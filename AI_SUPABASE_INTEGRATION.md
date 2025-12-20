# AI Advisor - Supabase Real-Time Data Integration

## Overview

The AI Advisor now connects to your Supabase database to provide **real-time, accurate answers** based on actual available properties, tours, and transport services instead of static responses.

## How It Works

### 1. Data Flow

```
User asks question
    ↓
AI Advisor detects query
    ↓
Fetches real-time data from Supabase
    ↓
Builds dynamic context with actual listings
    ↓
Sends to OpenAI GPT with context
    ↓
GPT responds with accurate, data-driven answer
    ↓
User gets current, real information
```

### 2. Integration Components

#### **src/services/aiContext.js** (NEW)
- Fetches real-time data from Supabase database
- Functions:
  - `getAccommodationsContext()` - Queries properties table
  - `getToursContext()` - Queries tours table (graceful fallback if not exists)
  - `getTransportContext()` - Queries transport services (graceful fallback)
  - `getMerry360XContext()` - Gets all data in parallel
  - `formatContextForAI()` - Formats data for GPT consumption

#### **src/services/openai.js** (UPDATED)
- Modified to accept dynamic context parameter
- `BASE_SYSTEM_PROMPT` - Core AI personality
- `getAIResponse()` - Now accepts `dynamicContext` parameter
- System prompt = Base prompt + Real-time data

#### **src/components/ai/AIConcierge.vue** (UPDATED)
- Import: Added `getMerry360XContext, formatContextForAI`
- Before calling GPT:
  1. Fetches real-time Supabase data
  2. Formats data as context
  3. Passes to OpenAI with user question
- AI now answers with current inventory

## Database Tables Used

### Properties Table (EXISTS ✅)
```sql
properties:
  - id (uuid)
  - name (text)
  - type (text)
  - location (text)
  - price (text)
  - bedrooms (integer)
  - bathrooms (numeric)
  - amenities (text[])
  - available (boolean)
```

### Tours Table (Optional - graceful fallback)
```sql
tours:
  - id (uuid)
  - title (text)
  - description (text)
  - price (text)
  - duration (text)
  - location (text)
  - available (boolean)
```

### Transport Services Table (Optional - graceful fallback)
```sql
transport_services:
  - id (uuid)
  - service_type (text)
  - route (text)
  - price (text)
  - vehicle_type (text)
  - available (boolean)
```

## Example Conversations

### Before (Static Data)
```
User: "What hotels do you have in Kigali?"
AI: "We have hotels ranging from $20-500/night in Kigali."
```

### After (Real-Time Data)
```
User: "What hotels do you have in Kigali?"
AI: "We have 12 properties in Kigali! Here are some options:

• Kigali Serena Hotel (hotel) - $250/night, 5 bed, 5 bath
• The Manor Hotel (boutique) - $180/night, 3 bed, 3 bath  
• Green View Guesthouse (guesthouse) - $45/night, 2 bed, 2 bath

Browse our Accommodations section to see all options with photos and reviews!"
```

## Features

✅ **Real-Time Data**: AI answers reflect current database inventory
✅ **Accurate Pricing**: Shows actual prices from database
✅ **Property Names**: References real property/tour names
✅ **Availability**: Only shows available listings
✅ **Graceful Degradation**: Falls back to helpful messages if tables don't exist
✅ **Error Handling**: Catches database errors without breaking AI
✅ **Performance**: Parallel queries for fast responses
✅ **Caching Ready**: Easy to add caching layer for optimization

## Testing

### Test AI with Real Data

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open AI Advisor** on the website

3. **Ask questions:**
   - "What accommodations are available?"
   - "Show me hotels in Kigali"
   - "What tours do you offer?"
   - "I need transportation"

4. **Check responses:**
   - Should reference actual property names from database
   - Should show real prices
   - Should match available inventory

### Verify Database Connection

Check browser console for:
- ✅ No Supabase query errors
- ✅ Data being fetched successfully
- ⚠️ Warnings if optional tables (tours/transport) don't exist

## Adding Sample Data

If your database is empty, add sample properties:

```sql
-- Sample accommodations
INSERT INTO properties (name, type, location, price, bedrooms, bathrooms, amenities, available)
VALUES 
  ('Kigali Serena Hotel', 'hotel', 'Kigali', '$250/night', 5, 5, ARRAY['WiFi', 'Pool', 'Restaurant'], true),
  ('The Manor Hotel', 'boutique', 'Kigali', '$180/night', 3, 3, ARRAY['WiFi', 'Bar', 'Garden'], true),
  ('Green View Guesthouse', 'guesthouse', 'Kigali', '$45/night', 2, 2, ARRAY['WiFi', 'Breakfast'], true);
```

## Future Enhancements

### 1. Add Tours & Transport Tables
Create dedicated tables for tours and transport to show real offerings:
```sql
CREATE TABLE tours (...);
CREATE TABLE transport_services (...);
```

### 2. Caching Layer
Add Redis/memory cache to reduce database queries:
```javascript
// Cache for 5 minutes
const cachedContext = await getCachedContext() || await getMerry360XContext()
```

### 3. Intent Detection
Analyze user message to fetch only relevant data:
```javascript
if (message.includes('hotel')) {
  context = await getAccommodationsContext() // Only fetch properties
}
```

### 4. Personalization
Factor in user preferences:
```javascript
const userBudget = getUserBudget()
const filteredProperties = properties.filter(p => p.price <= userBudget)
```

### 5. Real-Time Updates
Use Supabase real-time subscriptions to update AI context when inventory changes:
```javascript
supabase
  .channel('properties-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, 
    payload => refreshAIContext()
  )
  .subscribe()
```

## Configuration

### Environment Variables
```env
VITE_OPENAI_API_KEY=sk-proj-... # Your OpenAI API key
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_USE_SUPABASE=true
```

### Row Level Security (RLS)
Properties table has RLS enabled with public read access:
```sql
create policy "Properties are publicly readable" 
  on public.properties 
  for select 
  using (true);
```

## Troubleshooting

### AI gives generic responses
- Check: Is properties table populated with data?
- Check: Is `available = true` for listings?
- Check: Browser console for Supabase errors

### "Browse our section" responses
- This is the fallback when no data is found
- Add sample data to properties table
- Ensure Supabase connection is working

### Database errors in console
- Verify Supabase credentials in .env
- Check table names match (properties, tours, transport_services)
- Verify RLS policies allow public read access

## Summary

The AI Advisor is now **intelligent and data-aware**! It pulls real listings from your Supabase database and provides accurate, helpful responses based on what's actually available in your inventory.

Instead of saying "We have hotels from $20-500/night", it now says:
> "We have 12 properties in Kigali! Here's the Green View Guesthouse for $45/night, The Manor Hotel for $180/night..."

This makes the AI a powerful sales tool that can guide users to real, bookable properties! 🎉
