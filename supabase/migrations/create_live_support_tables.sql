-- Live Support System Tables

-- Support Conversations Table
CREATE TABLE IF NOT EXISTS support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  staff_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'waiting', 'closed')),
  is_ai BOOLEAN DEFAULT TRUE,
  needs_human BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  last_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Messages Table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'staff', 'ai', 'system')),
  content TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  staff_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_conversations_status ON support_conversations(status);
CREATE INDEX IF NOT EXISTS idx_support_conversations_user ON support_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_staff ON support_conversations(staff_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_needs_human ON support_conversations(needs_human);
CREATE INDEX IF NOT EXISTS idx_support_messages_conversation ON support_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created ON support_messages(created_at);

-- Enable Row Level Security
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_conversations
CREATE POLICY "Users can view their own conversations"
  ON support_conversations
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Users can create conversations"
  ON support_conversations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can update conversations"
  ON support_conversations
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    )
  );

-- RLS Policies for support_messages
CREATE POLICY "Users can view messages in their conversations"
  ON support_messages
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM support_conversations 
      WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Users can send messages to their conversations"
  ON support_messages
  FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM support_conversations 
      WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    )
  );

-- Function to update conversation's updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp on new message
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON support_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Function to update last_message in conversation
CREATE OR REPLACE FUNCTION update_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_conversations
  SET last_message = NEW.content
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message
CREATE TRIGGER update_last_message_on_insert
AFTER INSERT ON support_messages
FOR EACH ROW
EXECUTE FUNCTION update_last_message();
