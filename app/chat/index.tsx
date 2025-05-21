import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ROBOT_LOGO from '../../assets/images/ROBOT_LOGO.png';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Make the logo 25% of screen width:
const LOGO_SIZE = SCREEN_WIDTH * 0.25;
type Message = {
  id: string;
  text: string;
  sender: string;
};
export default function ChatScreen() {
  
  // State for the chat input and the conversation messages
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const FORECAST_URL = 'http://jetson.local:7000/predict';
  const OLLAMA_URL   = 'http://jetson.local:11434/api/generate';
  const MODEL_NAME   = 'hf.co/EmreGed/sunergy8bit8e';


   useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('chat_history');
      if (saved) setMessages(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);
  
  // This function sends the user message and calls the Ollama API
  const onSend = async () => {
    if (!userMessage.trim()) return;
    
    // Create a new message from the user and add it to state
    const newMessage = { 
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setUserMessage('');

    
     try {
      /* 2️⃣ Ask the forecast server */
      const predRes = await fetch(FORECAST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage.text }),
      });

    const { usage_wh, generation_wh, timeframe } = await predRes.json();

    /* 3️⃣ Build the final prompt */
    const prompt = `Given that the expected energy usage is ${usage_wh} Wh `
                 + `and expected solar generation is ${generation_wh} Wh `
                 + `with the current time ${Date.now().toString()} ${userMessage}?`;

    const response = await fetch( 'http://jetson.local:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,          // pick the model you want
        prompt: prompt,
        stream: true            // easier to parse for now
      }),
    });
      const data = await response.json();
      console.log("Ollama response:", data);

      // Create a new bot message with the returned response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Error calling Ollama API:", err);
      // Optionally, you could append an error message to the messages list
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, something went wrong.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      

      <LinearGradient
        colors={['#ECFDF5', '#D1FAE5']}
        style={styles.container}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Chat messages list */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.6 }
              ]}
            >
              <Ionicons name="arrow-back" size={24} color="#10B981" />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Optional: Top logo/header */}
            <View style={styles.logoContainer}>
              <Image source={ROBOT_LOGO} style={[
    styles.logo,
    { width: LOGO_SIZE, height: LOGO_SIZE }
  ]} />
            </View>

            {messages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userBubble : styles.botBubble
                ]}
              >
                <Text style={message.sender === 'user' ? styles.userText : styles.botText}>
                  {message.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Input area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={userMessage}
              onChangeText={setUserMessage}
              onSubmitEditing={onSend}          // ← call onSend when they hit “enter”
              returnKeyType="send"              // ← show a “Send” button on the keyboard
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
    backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#10B981',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  messageBubble: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  userText: {
    fontSize: 16,
    color: '#000'
  },
  botText: {
    fontSize: 16,
    color: '#000'
  },
  inputContainer: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8
  },
  sendButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});
