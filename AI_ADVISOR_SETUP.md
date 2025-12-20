# AI Advisor Setup Guide

The AI Advisor uses OpenAI's GPT API to provide intelligent, context-aware responses to travelers.

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy your API key (it starts with `sk-`)

### 2. Configure Your Environment

Add your OpenAI API key to the `.env` file:

```bash
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important:** Never commit your `.env` file to version control!

### 3. How It Works

The AI Advisor:
- ✅ Uses GPT-3.5-turbo for fast, cost-effective responses
- ✅ Maintains conversation context (last 5 exchanges)
- ✅ Has a custom system prompt trained on Rwanda travel info
- ✅ Keeps responses concise (max 300 tokens)
- ✅ Falls back to rule-based responses if API fails
- ✅ Allows admin takeover for human support

### 4. Features

**AI Mode:**
- Real-time GPT-powered responses
- Context-aware conversations
- Trained on Merry360X services
- Automatic fallback on errors

**Admin Mode:**
- Users can request human support
- Support clearance levels:
  - Support Agent
  - Support Manager  
  - Administrator
- Seamless AI-to-human handoff

### 5. API Costs

OpenAI GPT-3.5-turbo pricing:
- ~$0.0015 per 1K tokens (input)
- ~$0.002 per 1K tokens (output)
- Average conversation: ~$0.01-0.05

To upgrade to GPT-4:
```javascript
// In src/services/openai.js, change the model parameter:
export async function chatWithAI(messages, model = 'gpt-4') {
```

### 6. Testing

Test the AI without API key:
- System automatically falls back to rule-based responses
- Check browser console for "OpenAI API key not configured"

With API key:
- Responses are powered by GPT
- Check Network tab to see API calls
- Monitor console for any errors

### 7. Production Deployment

For Vercel deployment:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add: `VITE_OPENAI_API_KEY` = `your-api-key`
4. Redeploy the application

### 8. Security Best Practices

- ✅ Never expose API key in client code
- ✅ Use environment variables only
- ✅ Add `.env` to `.gitignore`
- ✅ Rotate keys regularly
- ✅ Set usage limits in OpenAI dashboard
- ✅ Monitor API usage and costs

### 9. Customization

Edit the AI's behavior in `src/services/openai.js`:

```javascript
const SYSTEM_PROMPT = `
  Your custom instructions here...
`
```

Adjust response length:
```javascript
max_tokens: 300  // Increase for longer responses
```

### 10. Troubleshooting

**"OpenAI API key not configured"**
- Check `.env` file has correct key
- Restart dev server after adding key
- Verify key starts with `sk-`

**API Rate Limits**
- OpenAI has rate limits per minute
- Upgrade your OpenAI account tier
- Implement request throttling

**Slow Responses**
- GPT-3.5-turbo is fastest
- Consider caching common queries
- Use max_tokens to limit length

## Support

For issues or questions:
- Check OpenAI documentation: https://platform.openai.com/docs
- Review API status: https://status.openai.com/
- Contact support team

---

**Note:** The AI Advisor works without OpenAI API by using fallback responses. Add the API key to unlock GPT-powered conversations!
