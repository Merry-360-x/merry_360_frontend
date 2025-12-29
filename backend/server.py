from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import cloudinary
import cloudinary.uploader
import cloudinary.api
from supabase import create_client, Client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

# Supabase configuration
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Define Models
class ImageRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    public_id: str
    url: str
    secure_url: str
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class StatusCheckCreate(BaseModel):
    client_name: str


# Health check endpoints
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.get("/health")
async def health_check():
    """Check connection status of all services"""
    status = {
        "backend": "connected",
        "cloudinary": "disconnected",
        "supabase": "disconnected"
    }
    
    # Test Cloudinary connection
    try:
        cloudinary.api.ping()
        status["cloudinary"] = "connected"
    except Exception as e:
        logger.error(f"Cloudinary connection error: {str(e)}")
        status["cloudinary"] = f"error: {str(e)}"
    
    # Test Supabase connection
    try:
        # Try a simple query to test connection
        result = supabase.table('images').select("id").limit(1).execute()
        status["supabase"] = "connected"
    except Exception as e:
        logger.error(f"Supabase connection error: {str(e)}")
        # Check if table doesn't exist (which is fine for first run)
        if "does not exist" in str(e).lower() or "relation" in str(e).lower():
            status["supabase"] = "connected (table may need creation)"
        else:
            status["supabase"] = f"error: {str(e)}"
    
    return status


# Cloudinary endpoints
@api_router.post("/upload", response_model=ImageRecord)
async def upload_image(file: UploadFile = File(...)):
    """Upload an image to Cloudinary and store metadata in Supabase"""
    try:
        # Read file content
        contents = await file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            contents,
            folder="uploads",
            resource_type="auto"
        )
        
        # Create image record
        image_record = ImageRecord(
            public_id=result['public_id'],
            url=result['url'],
            secure_url=result['secure_url'],
            width=result.get('width'),
            height=result.get('height'),
            format=result.get('format')
        )
        
        # Store metadata in Supabase
        try:
            supabase.table('images').insert(image_record.model_dump()).execute()
        except Exception as e:
            logger.warning(f"Could not save to Supabase: {str(e)}")
        
        return image_record
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@api_router.get("/images", response_model=List[ImageRecord])
async def get_images():
    """Get all images from Supabase"""
    try:
        result = supabase.table('images').select("*").order('created_at', desc=True).execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching images: {str(e)}")
        # Return empty list if table doesn't exist yet
        return []


@api_router.delete("/images/{image_id}")
async def delete_image(image_id: str):
    """Delete an image from Cloudinary and Supabase"""
    try:
        # Get image record from Supabase
        result = supabase.table('images').select("*").eq('id', image_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Image not found")
        
        image = result.data[0]
        
        # Delete from Cloudinary
        cloudinary.uploader.destroy(image['public_id'])
        
        # Delete from Supabase
        supabase.table('images').delete().eq('id', image_id).execute()
        
        return {"message": "Image deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")


# Status check endpoints (using Supabase)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """Create a status check record in Supabase"""
    try:
        status_obj = StatusCheck(client_name=input.client_name)
        result = supabase.table('status_checks').insert(status_obj.model_dump()).execute()
        return status_obj
    except Exception as e:
        logger.error(f"Status check creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create status check: {str(e)}")


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """Get all status checks from Supabase"""
    try:
        result = supabase.table('status_checks').select("*").order('timestamp', desc=True).execute()
        return result.data
    except Exception as e:
        logger.error(f"Error fetching status checks: {str(e)}")
        return []


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
