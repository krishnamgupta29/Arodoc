"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Bot, Send, Mic, MicOff, AlertCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SpeechRecognitionEvent } from "web-speech-api"

type SpeechRecognitionType = typeof window.SpeechRecognition

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isEmergency?: boolean
}

const RESPONSES: Record<string, string[]> = {
  // Greetings
  greeting: [
    "Hello! I'm Arodoc AI, your friendly health assistant. How can I help you today?",
    "Hi there! Welcome to Arodoc. What health concerns can I assist you with?",
    "Hey! Great to see you. I'm here to help with any health questions you have!",
    "Good to have you here! Tell me, how are you feeling today?",
    "Hello! I hope you're doing well. What brings you to me today?",
  ],

  // Head / Brain
  headache: [
    "I'm sorry to hear about your headache! Can you tell me if it's mild, moderate, or severe?",
    "Oh no! Headaches can be annoying. How long have you been feeling it?",
    "I hope you're okay. Any nausea or sensitivity to light along with the headache?",
    "It sounds uncomfortable. Did it start suddenly or gradually?",
    "Headaches can be triggered by stress, dehydration, or lack of sleep. Have you had enough water today?",
  ],
  migraine: [
    "Migraines can be very challenging. Are you experiencing sensitivity to light or sound?",
    "I understand migraines are tough. Do you get any warning signs before they start?",
    "Rest in a dark, quiet room and stay hydrated. How often do you get these migraines?",
    "That sounds difficult. Have you identified any triggers for your migraines?",
    "Migraines need attention. Are you taking any preventive medication?",
  ],
  dizzy: [
    "Dizziness can be unsettling. Did it start suddenly or gradually?",
    "I hope you're sitting safely! Is the room spinning or do you feel lightheaded?",
    "Have you eaten and had enough water today? Low blood sugar can cause this.",
    "Please sit or lie down if you feel dizzy. When did this start?",
    "Dizziness has many causes. Any other symptoms like nausea or ringing in ears?",
  ],
  lightheaded: [
    "Feeling lightheaded? Please sit down if you haven't already. Have you eaten recently?",
    "That can be concerning. Are you well-hydrated? Sometimes dehydration causes this.",
    "Take it easy! Did you stand up too quickly, or has this been ongoing?",
    "Lightheadedness often improves with rest and hydration. How long have you felt this way?",
  ],

  // Chest / Heart
  chest: [
    "Chest pain can be serious. Please take it easy and contact a doctor soon!",
    "I'm here to help! Can you describe if the pain is sharp, dull, or pressure-like?",
    "Let's make sure you're safe. Any sweating or shortness of breath with it?",
    "Is the pain constant or does it come and go? Does it spread to your arm or jaw?",
    "Please rest and avoid exertion. If pain is severe, seek emergency care immediately.",
  ],
  palpitations: [
    "Heart palpitations can feel scary, but they're often harmless. Are you feeling anxious?",
    "How often are you experiencing these palpitations? Are they brief or prolonged?",
    "Try to relax and take slow, deep breaths. Have you had caffeine recently?",
    "Palpitations can be triggered by stress, caffeine, or lack of sleep. Any of these apply?",
  ],
  heart: [
    "Heart health is so important! What specific symptoms are you experiencing?",
    "I care about your heart health. Are you having any pain, palpitations, or shortness of breath?",
    "Regular exercise and a balanced diet are key for heart health. Any concerns I can address?",
    "Your heart matters! Tell me more about what you're feeling.",
  ],

  // Stomach / Digestive
  stomach: [
    "Ouch! Where exactly is the stomach pain? Upper, lower, or around the belly button?",
    "I hope you feel better soon. Have you eaten anything unusual lately?",
    "Stomach troubles are no fun. Is the pain constant or does it come in waves?",
    "Stay hydrated! Is there any nausea or changes in appetite along with the pain?",
    "That sounds uncomfortable. When did the stomach pain start?",
  ],
  nausea: [
    "Nausea is uncomfortable. I hope you feel better soon! When did it start?",
    "Oh dear! Are you also experiencing any vomiting or dizziness?",
    "Try sipping ginger tea or eating small, bland crackers. How severe is the nausea?",
    "Take it easy and rest. Has anything you ate disagreed with you?",
    "If nausea persists for more than 24 hours, please see a doctor!",
  ],
  vomiting: [
    "Stay hydrated with small sips of water! How many times have you vomited?",
    "That sounds rough. Is there any blood in the vomit?",
    "Try oral rehydration solutions. Can you keep small amounts of liquid down?",
    "Rest and sip fluids slowly. Seek help if you can't keep anything down for 24 hours.",
  ],
  diarrhea: [
    "Stay hydrated! Drink plenty of fluids - water or oral rehydration salts are best.",
    "How many times have you had loose stools today? Any blood or mucus?",
    "Avoid dairy, fatty, and spicy foods for now. Has this happened before?",
    "Keep drinking fluids! See a doctor if it lasts more than 2-3 days.",
  ],
  constipation: [
    "Constipation is frustrating! Increase fiber and water intake - that usually helps.",
    "How long have you been constipated? Fruits and vegetables can help.",
    "Try gentle exercise like walking after meals. Are you drinking enough water?",
    "That's uncomfortable. Have you tried prunes or high-fiber cereals?",
  ],
  bloating: [
    "Bloating is uncomfortable! What did you eat recently?",
    "Try avoiding carbonated drinks and eating slowly to reduce air swallowing.",
    "Smaller, more frequent meals can help with bloating. Any other digestive issues?",
    "That uncomfortable feeling! Walking after meals sometimes helps relieve bloating.",
  ],

  // Fever / Infection
  fever: [
    "I hope you're resting well! How high is your temperature?",
    "Stay hydrated and warm. Do you have any other symptoms like cough or body aches?",
    "Flu can be exhausting. Make sure to rest and eat nutritious food!",
    "If the fever lasts more than 3 days, a doctor visit is recommended.",
    "Take paracetamol for relief if needed. Are you able to rest today?",
  ],
  cold: [
    "I hope you feel better soon! Rest and warm fluids like soup will help.",
    "A common cold usually resolves in 7-10 days. Are your symptoms getting worse?",
    "Honey and ginger in warm water can soothe your symptoms. Get lots of rest!",
    "Take care of yourself! Plenty of fluids and rest are the best medicine.",
  ],
  flu: [
    "Flu can be tough. Rest is essential! Are you experiencing body aches and high fever?",
    "Stay home and hydrated. The flu usually improves in about a week.",
    "If symptoms are severe or you're high-risk, consult a doctor about antivirals.",
    "Flu is exhausting! Make sure you're getting enough fluids and sleep.",
  ],
  infection: [
    "What type of infection are you concerned about? I'm here to help!",
    "Infections need proper care. Can you describe your symptoms?",
    "Keep the affected area clean. What symptoms are you experiencing?",
    "Let me help! Tell me more about the infection symptoms you're having.",
  ],
  sore: [
    "A sore throat can be miserable! Is it painful to swallow?",
    "Gargle with warm salt water - it really helps! How long have you had this?",
    "Lozenges and warm drinks can soothe your throat. Any fever with it?",
    "I hope it feels better soon! Are you also experiencing any cold symptoms?",
  ],

  // Respiratory
  cough: [
    "Is your cough dry or producing mucus? That helps me understand better.",
    "How long have you had this cough? Is it worse at night?",
    "Stay hydrated and try honey in warm water. Any chest discomfort with the cough?",
    "Coughs can linger! If it persists more than 2 weeks, see a doctor.",
  ],
  throat: [
    "A sore throat is no fun! Are you having difficulty swallowing?",
    "Gargle with warm salt water and stay hydrated. How long has it hurt?",
    "Lozenges or honey can help soothe it. Any white spots in your throat?",
    "Take care of your throat! Warm drinks and rest can help a lot.",
  ],
  breath: [
    "Shortness of breath can be concerning. Did it come on suddenly?",
    "Are you experiencing any chest pain or wheezing along with it?",
    "Please rest and breathe slowly. If breathing is very difficult, seek immediate help!",
    "That sounds worrying. Can you tell me when this started?",
  ],
  breathing: [
    "Breathing difficulties need attention. How severe is it on a scale of 1-10?",
    "Try to stay calm and breathe slowly. Any known conditions like asthma?",
    "If you're struggling to breathe, please seek emergency care immediately.",
    "Is this a new symptom or have you experienced this before?",
  ],
  asthma: [
    "Are you using your inhaler as prescribed? Keep it accessible!",
    "Identify and avoid your triggers. Is your current plan working for you?",
    "If symptoms are worsening, please consult your doctor for a treatment review.",
    "Asthma management is key. Have you had any recent attacks?",
  ],

  // Sleep / Fatigue / Mental Health
  tired: [
    "I'm sorry you're feeling tired. Are you getting enough sleep at night?",
    "Fatigue can have many causes. How's your sleep and stress level?",
    "Make sure you're eating well and staying hydrated! How long have you felt tired?",
    "Being tired is no fun. Is this recent or has it been ongoing?",
  ],
  fatigue: [
    "Persistent fatigue deserves attention. How long have you been feeling this way?",
    "Are you sleeping well and eating properly? Both affect energy levels.",
    "Fatigue can be frustrating. Have you noticed any other symptoms?",
    "Let's figure this out! Is the fatigue affecting your daily activities?",
  ],
  sleep: [
    "Good sleep hygiene is so important! What time do you usually go to bed?",
    "Try avoiding screens before bed. Do you have a regular sleep schedule?",
    "Sleep troubles can be frustrating. How many hours are you getting?",
    "A consistent bedtime routine can really help. What's disrupting your sleep?",
  ],
  insomnia: [
    "Insomnia is so frustrating! Have you tried relaxation techniques before bed?",
    "Avoid caffeine and heavy meals in the evening. When did this start?",
    "Your sleep matters! Consider keeping a sleep diary to track patterns.",
    "There are effective treatments for insomnia. How long has this been happening?",
  ],
  anxiety: [
    "I'm sorry you're feeling anxious. Deep breathing exercises can help right now.",
    "Anxiety is challenging. Would you like some immediate calming techniques?",
    "You're not alone in this. Regular exercise and good sleep can help manage anxiety.",
    "I care about your wellbeing. Have you considered speaking with a counselor?",
  ],
  stress: [
    "Stress management is so important. What's causing you the most stress right now?",
    "Try deep breathing, meditation, or a short walk. These can really help!",
    "Your wellbeing matters! If stress is overwhelming, please consider professional support.",
    "Stress affects health in many ways. What helps you relax usually?",
  ],
  depression: [
    "I appreciate you sharing this with me. Please know that help is available.",
    "You're not alone. Depression is treatable, and reaching out is a brave first step.",
    "Your feelings are valid. Consider speaking with a mental health professional.",
    "I'm here for you. Depression can improve with the right support - please seek help.",
  ],
  sad: [
    "I'm sorry you're feeling sad. Would you like to talk about what's going on?",
    "It's okay to feel sad sometimes. Is there something specific bothering you?",
    "Your feelings matter. If sadness persists, consider talking to someone who can help.",
    "I'm here to listen. Has something happened to make you feel this way?",
  ],

  // Skin
  rash: [
    "I hope you're okay! Where is the rash located, and does it itch?",
    "Is the rash spreading or staying in one area? Any new products used?",
    "Avoid scratching! See a doctor if it comes with fever or spreads rapidly.",
    "Rashes can have many causes. When did you first notice it?",
  ],
  itchy: [
    "Itching can be so annoying! Is it localized or all over your body?",
    "Moisturizers can help with dry skin itchiness. Any rash with the itching?",
    "Try to avoid scratching. Have you been exposed to any new products?",
    "That sounds uncomfortable! How long has the itching been going on?",
  ],
  acne: [
    "Acne can be frustrating. Cleanse gently and avoid touching the face!",
    "Over-the-counter products with benzoyl peroxide may help. What's your routine?",
    "Be patient - acne treatments take time. Are you stressed or eating differently?",
    "Your skin matters! If acne is severe, a dermatologist can offer great solutions.",
  ],
  skin: [
    "What's going on with your skin? I'm here to help!",
    "Skin concerns vary a lot. Can you describe what you're seeing or feeling?",
    "Let's figure this out! Is there itching, redness, or any other symptoms?",
    "Your skin health matters. Tell me more about what's bothering you.",
  ],
  hair: [
    "Hair fall can happen due to stress or diet. Are you eating well?",
    "Hair concerns are common. Is this recent hair loss or has it been ongoing?",
    "Stay hydrated and eat protein-rich foods! Have you been stressed lately?",
    "Let's understand this better. Any other symptoms along with hair issues?",
  ],

  // Muscles / Joints / Bones
  back: [
    "Back pain is so common but uncomfortable! Is it upper or lower back?",
    "Did it start suddenly or gradually? Any specific activity that triggered it?",
    "Try gentle stretching and maintaining good posture. Heat or ice can help too!",
    "That sounds painful. Does it radiate to your legs or cause numbness?",
  ],
  joint: [
    "Which joint is affected? Is there any swelling or redness?",
    "Joint pain can be frustrating. Did you injure it or did it start on its own?",
    "Rest the joint and try ice if there's swelling. How long has it hurt?",
    "I hope it feels better soon! Does the pain affect your movement?",
  ],
  muscle: [
    "Muscle pain often comes from overuse. Did you exercise or lift something heavy?",
    "Gentle stretching and rest usually help. Is the pain localized or widespread?",
    "Heat application can soothe sore muscles. When did this start?",
    "That sounds uncomfortable! Any specific activity that might have caused it?",
  ],
  knee: [
    "Knee pain can really limit you. Did you injure it or did it start gradually?",
    "Try the RICE method: Rest, Ice, Compression, Elevation. Is there swelling?",
    "Can you bear weight on it? If not, it's best to see a doctor.",
    "Knee issues are common. Does it hurt more with stairs or specific movements?",
  ],
  leg: [
    "Leg pain can have many causes. Where exactly does it hurt?",
    "Is the pain in the muscles, joints, or does it feel deeper?",
    "Did you do any physical activity recently that might have caused this?",
    "Rest and elevation can help. Is there any swelling or discoloration?",
  ],
  sprain: [
    "Ouch! For sprains, remember RICE: Rest, Ice, Compression, Elevation.",
    "Avoid putting weight on the affected area. How did it happen?",
    "See a doctor if swelling is severe or you can't use the affected limb.",
    "Sprains need time to heal. Is it still very swollen?",
  ],
  pain: [
    "I'm sorry you're in pain. Can you tell me where exactly it hurts?",
    "Pain can have many causes. Is it sharp, dull, or throbbing?",
    "When did the pain start? Has anything made it better or worse?",
    "Let me help! Describe the pain and location so I can assist better.",
    "That sounds uncomfortable. On a scale of 1-10, how severe is the pain?",
  ],

  // Eyes / Ears / Mouth
  eye: [
    "Eye issues need attention! Any redness, dryness, or discharge?",
    "Avoid rubbing your eyes. What symptoms are you experiencing?",
    "See an eye doctor if you have vision changes or persistent symptoms.",
    "Eye health is important! Is your vision affected at all?",
  ],
  ear: [
    "Ear pain can be tricky. Is it in one ear or both?",
    "Is there any discharge or hearing changes? When did it start?",
    "Don't put anything in the ear canal. Has this happened before?",
    "Ear pain with fever may need medical attention. Any fever?",
  ],
  toothache: [
    "Toothache pain is tough! When did it start?",
    "Rinse with warm salt water for some relief. Can you see your dentist soon?",
    "Is there any swelling in your gums or face?",
    "Dental issues need dental care! Please see a dentist, especially if there's fever.",
  ],
  mouth: [
    "Mouth issues can be uncomfortable. What specifically is bothering you?",
    "Any ulcers, pain, or swelling in your mouth?",
    "Good oral hygiene helps many mouth problems. How long has this been going on?",
    "Let me help! Is it your gums, tongue, or somewhere else?",
  ],

  // Women's Health
  period: [
    "Are the cramps mild or severe? I hope you're comfortable.",
    "Heat packs and pain relief can help with menstrual cramps!",
    "Tracking your cycle can be really helpful. Is this pain unusual for you?",
    "Period pain is common but shouldn't be debilitating. How are you coping?",
  ],
  menstrual: [
    "Menstrual issues vary. What specifically concerns you?",
    "A regular cycle is typically 21-35 days. Is yours regular?",
    "Tracking apps can help you understand your patterns. Any unusual symptoms?",
    "Your menstrual health matters! Tell me more about what you're experiencing.",
  ],
  cramps: [
    "Cramps are no fun! Heat packs and gentle stretching can help.",
    "How severe are the cramps? Are they affecting your daily activities?",
    "Stay hydrated and try over-the-counter pain relief. Does anything help?",
    "I hope you feel better! Are these cramps during your period or at other times?",
  ],
  pregnancy: [
    "For pregnancy-related queries, always consult your obstetrician for safety!",
    "Prenatal care is so important. Are you currently pregnant or planning?",
    "I recommend speaking with your doctor for personalized pregnancy advice.",
    "Congratulations if you're expecting! Your doctor is the best resource for pregnancy questions.",
  ],
  pcos: [
    "PCOS management involves lifestyle and sometimes medication. Have you been diagnosed?",
    "Regular exercise and a balanced diet can help manage PCOS symptoms.",
    "I recommend working closely with your gynecologist for PCOS management.",
    "PCOS is manageable! What symptoms are bothering you most?",
  ],

  // Men's Health
  prostate: [
    "Prostate health is important, especially as you age. Any specific symptoms?",
    "Regular check-ups are recommended for men over 50.",
    "Urinary changes can indicate prostate issues. Are you experiencing any?",
    "Consult a urologist for any prostate concerns. They can help!",
  ],
  testicular: [
    "Testicular pain should be checked by a doctor promptly.",
    "Any swelling or lumps should be examined by a healthcare provider.",
    "Don't delay! Testicular issues need professional evaluation.",
    "I recommend seeing a doctor soon for testicular concerns.",
  ],

  // General Health Topics
  allergy: [
    "Allergies can be miserable! What triggers your symptoms?",
    "Avoid known allergens and try antihistamines for relief.",
    "Is this a new allergy or a recurring one? What symptoms do you have?",
    "If allergies significantly affect your life, an allergist can help!",
  ],
  dehydration: [
    "Drink up! Water, oral rehydration solutions, or clear broths all help.",
    "Signs of dehydration include dark urine and dizziness. How are you feeling?",
    "Staying hydrated is so important! How much water have you had today?",
    "Seek help if you can't keep fluids down or feel very weak.",
  ],
  diet: [
    "A balanced diet is key to health! What would you like to improve?",
    "Include plenty of fruits, vegetables, and whole grains. Any specific goals?",
    "Nutrition is fascinating! What dietary questions do you have?",
    "Consider consulting a nutritionist for personalized advice!",
  ],
  exercise: [
    "Exercise is wonderful for health! What type interests you?",
    "Aim for at least 150 minutes of moderate activity weekly. Do you exercise currently?",
    "Start slow and build up gradually. What are your fitness goals?",
    "Movement is medicine! Even walking counts as great exercise.",
  ],
  weight: [
    "Healthy weight involves nutrition and activity. What are your goals?",
    "Weight management is a journey. Are you looking to gain or lose?",
    "A healthcare provider can give personalized weight guidance.",
    "Sustainable changes work best! What approach interests you?",
  ],
  yoga: [
    "Yoga is excellent for body and mind! Are you a beginner?",
    "Start with beginner poses and progress gradually. What draws you to yoga?",
    "Many free resources online can teach yoga safely!",
    "Yoga can help flexibility, strength, and stress. Would you like tips?",
  ],
  meditation: [
    "Meditation is so beneficial! Even 5-10 minutes daily helps.",
    "Try guided meditation apps if you're new. Have you tried it before?",
    "Meditation reduces stress and improves focus. Interested in starting?",
    "There are many styles of meditation. What appeals to you?",
  ],
  vitamin: [
    "Vitamins are important! Are you concerned about a specific deficiency?",
    "A balanced diet usually provides needed vitamins. What's your concern?",
    "Blood tests can check vitamin levels. Have you had any done recently?",
    "Which vitamin are you curious about? I can share information!",
  ],
  immunity: [
    "Strong immunity comes from good sleep, nutrition, and exercise!",
    "Boosting immunity naturally involves healthy lifestyle habits.",
    "Vitamin C, zinc, and adequate sleep support immune function.",
    "What aspect of immunity concerns you? I'm happy to help!",
  ],
  bp: [
    "Blood pressure monitoring is important! Do you check yours regularly?",
    "Healthy diet, exercise, and stress management help maintain good BP.",
    "If readings are consistently high, please consult your doctor.",
    "What are your recent blood pressure readings?",
  ],
  pressure: [
    "Blood pressure management involves lifestyle and sometimes medication.",
    "Regular monitoring is key. Do you know your recent readings?",
    "Low salt, regular exercise, and stress reduction all help!",
    "High or low pressure both need attention. Which concerns you?",
  ],
  sugar: [
    "Blood sugar management is crucial! Are you diabetic?",
    "Balanced meals and regular monitoring help control blood sugar.",
    "What are your recent blood sugar levels?",
    "Diet plays a huge role in sugar control. Would you like tips?",
  ],
  diabetes: [
    "Diabetes management involves diet, exercise, and medication as needed.",
    "Regular monitoring and check-ups are essential. How's your management going?",
    "Work closely with your healthcare team. Any specific concerns?",
    "Diabetes is very manageable with the right approach! How can I help?",
  ],
  thyroid: [
    "Thyroid issues need proper diagnosis. Have you had recent blood tests?",
    "Take medication as prescribed, typically on an empty stomach.",
    "Regular follow-up is important for thyroid management.",
    "What thyroid symptoms are you experiencing?",
  ],
  cholesterol: [
    "Cholesterol management involves diet, exercise, and sometimes medication.",
    "Reduce saturated fats and increase fiber for better cholesterol.",
    "Have you had your levels checked recently?",
    "Heart-healthy eating can significantly improve cholesterol!",
  ],

  // Emergency
  emergency: [
    "If this is a medical emergency, please call emergency services (108/112) immediately!",
    "Use the EMERGENCY SOS button below for immediate assistance.",
    "Please seek immediate medical attention. Don't delay in emergencies!",
    "Your safety comes first! Call 108 right now if this is urgent.",
  ],
  attack: [
    "If you're having a heart attack or stroke, call 108 immediately!",
    "Heart attack signs: chest pain, arm pain, shortness of breath. Call for help!",
    "Stroke signs: face drooping, arm weakness, speech difficulty. Act FAST!",
    "Don't wait! These symptoms need emergency care right now.",
  ],
  unconscious: [
    "If someone is unconscious, call emergency services immediately!",
    "Check for breathing and pulse. Start CPR if trained and needed.",
    "Don't move the person unless they're in immediate danger.",
    "Call 108 right now and stay with the person!",
  ],
  bleeding: [
    "Apply firm pressure with a clean cloth to stop bleeding.",
    "If bleeding is severe and won't stop, call emergency services!",
    "Keep the injured area elevated if possible while applying pressure.",
    "Severe bleeding needs immediate medical attention!",
  ],
  seizure: [
    "During a seizure, protect the person but don't restrain them.",
    "Don't put anything in their mouth. Time the seizure.",
    "Call 108 if the seizure lasts more than 5 minutes.",
    "Keep them safe from injury and stay calm.",
  ],
  accident: [
    "If there's been an accident, call emergency services immediately!",
    "Don't move injured persons unless they're in danger.",
    "Stay calm and call 108 for professional help.",
    "Your safety and getting help quickly is most important!",
  ],

  // Hindi responses
  bukhar: [
    "आराम करें और खूब पानी पिएं! बुखार कितना है?",
    "क्या आपको खांसी या बदन दर्द भी है?",
    "अगर बुखार 3 दिन से ज्यादा रहे तो डॉक्टर से मिलें।",
    "पैरासिटामोल ले सकते हैं। आराम कर रहे हैं?",
  ],
  dard: [
    "दर्द कहाँ है? क्या यह तेज़ है या हल्का?",
    "कब से दर्द हो रहा है?",
    "आराम करें और अगर दर्द बढ़े तो डॉक्टर से संपर्क करें।",
    "मुझे दर्द की जगह और तरह बताएं, मैं मदद करूंगा!",
  ],
  sir: [
    "सिर दर्द कब से है?",
    "क्या आपको चक्कर या उल्टी भी आ रही है?",
    "पानी पिएं और आराम करें। अगर दर्द जारी रहे तो डॉक्टर को दिखाएं।",
    "सिर दर्द तनाव से भी होता है। क्या आप stressed हैं?",
  ],
  pet: [
    "पेट में दर्द कहाँ है - ऊपर, नीचे, या बीच में?",
    "क्या कुछ अलग खाया था?",
    "हल्का खाना खाएं और पानी पिएं।",
    "पेट की तकलीफ बढ़े तो डॉक्टर से मिलें।",
  ],
  neend: [
    "अच्छी नींद के लिए सोने का एक नियमित समय रखें।",
    "सोने से पहले फोन का इस्तेमाल कम करें।",
    "नींद की समस्या लगातार हो तो डॉक्टर से बात करें।",
    "कितने घंटे की नींद ले रहे हैं?",
  ],
  thakan: [
    "थकान कई कारणों से हो सकती है। पर्याप्त आराम कर रहे हैं?",
    "खाने-पीने का ध्यान रखें और पर्याप्त पानी पिएं।",
    "अगर थकान लंबे समय तक रहे तो जांच करवाएं।",
    "कब से थकान महसूस हो रही है?",
  ],
  khansi: [
    "खांसी कब से है? सूखी है या बलगम वाली?",
    "गर्म पानी और शहद पिएं। आराम मिलेगा।",
    "अगर खांसी 2 हफ्ते से ज्यादा रहे तो डॉक्टर से मिलें।",
    "क्या खांसी के साथ बुखार भी है?",
  ],
  chakkar: [
    "चक्कर आ रहे हैं? बैठ जाइए पहले।",
    "पानी पिया है? कमज़ोरी से भी चक्कर आते हैं।",
    "अगर बार-बार चक्कर आएं तो जांच करवाएं।",
    "कब से चक्कर आ रहे हैं?",
  ],
  namaste: [
    "नमस्ते! मैं Arodoc AI हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    "नमस्ते! स्वागत है। आपकी तबीयत कैसी है?",
    "नमस्ते! बताइए, क्या परेशानी है?",
    "नमस्ते! आपकी सेहत से जुड़े सवालों में मदद के लिए हाज़िर हूं!",
  ],

  // What/How/General questions
  what: [
    "That's a great question! Can you give me a bit more detail?",
    "I'd be happy to help! What specifically would you like to know?",
    "Tell me more so I can give you the best answer!",
    "Good question! What aspect interests you most?",
  ],
  how: [
    "Let me help you with that! Can you be more specific?",
    "I'm here to guide you! What would you like to know how to do?",
    "Great question! Tell me more details and I'll assist.",
    "I'd love to help! What specifically do you want to understand?",
  ],
  why: [
    "That's a thoughtful question! What's the context?",
    "I can explain! What specifically are you curious about?",
    "Let me help answer that! Can you give more details?",
    "Good thinking! Tell me more about your question.",
  ],
  help: [
    "I'm here to help! What's on your mind?",
    "Of course I'll help! Tell me what you need.",
    "That's what I'm here for! What can I assist with?",
    "Happy to help! What would you like to know?",
  ],
  thank: [
    "You're very welcome! Feel free to ask if you have more questions.",
    "Happy to help! Take care of yourself!",
    "Anytime! Wishing you good health!",
    "Glad I could assist! Stay healthy!",
  ],
  bye: [
    "Take care! Feel free to come back anytime you need help.",
    "Goodbye! Wishing you good health!",
    "Bye! Don't hesitate to return if you have questions.",
    "Take care of yourself! See you next time!",
  ],
  okay: [
    "Great! Is there anything else I can help you with?",
    "Sounds good! Let me know if you have more questions.",
    "Perfect! Feel free to ask anything else.",
    "Alright! I'm here if you need more information.",
  ],
  yes: [
    "Got it! What else would you like to know?",
    "Okay! How can I help further?",
    "Understood! Any other questions?",
    "Great! Feel free to continue.",
  ],
  no: [
    "No problem! Let me know if there's anything else.",
    "Alright! I'm here if you need anything.",
    "Okay! Feel free to ask if something comes up.",
    "Got it! Take care!",
  ],

  // Fallback - friendly responses that never say "I don't understand"
  fallback: [
    "That's interesting! Can you tell me more about your symptoms or concerns?",
    "I'm listening! Could you describe what you're experiencing in more detail?",
    "I want to help you! Can you share more specifics about how you're feeling?",
    "Thanks for reaching out! What health topic would you like to discuss?",
    "I'm here for you! Can you elaborate so I can give better guidance?",
    "Let me assist you better! What symptoms or health concerns do you have?",
    "I care about your health! Tell me more about what's bothering you.",
    "Your wellbeing matters! Can you describe your concern in more detail?",
  ],
}

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "stroke",
  "unconscious",
  "can't breathe",
  "cannot breathe",
  "severe bleeding",
  "seizure",
  "collapsed",
  "emergency",
  "dying",
  "suicide",
  "सीने में दर्द",
  "दिल का दौरा",
  "बेहोश",
  "सांस नहीं",
  "खून बह रहा",
]

const usedResponses: Map<string, Set<number>> = new Map()

function getRandomResponse(category: string): string {
  const responses = RESPONSES[category]
  if (!responses || responses.length === 0) {
    return RESPONSES.fallback[Math.floor(Math.random() * RESPONSES.fallback.length)]
  }

  // Get or create used indices set for this category
  if (!usedResponses.has(category)) {
    usedResponses.set(category, new Set())
  }
  const used = usedResponses.get(category)!

  // If all responses used, reset
  if (used.size >= responses.length) {
    used.clear()
  }

  // Find unused response
  let index: number
  do {
    index = Math.floor(Math.random() * responses.length)
  } while (used.has(index) && used.size < responses.length)

  used.add(index)
  return responses[index]
}

function getKeywordResponse(input: string): { response: string; isEmergency: boolean } {
  const lowerInput = input.toLowerCase().trim()

  // Check for emergency first
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (lowerInput.includes(keyword.toLowerCase())) {
      return {
        response: getRandomResponse("emergency"),
        isEmergency: true,
      }
    }
  }

  // Check for greetings
  const greetings = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good evening",
    "good afternoon",
    "namaste",
    "namaskar",
    "नमस्ते",
  ]
  if (greetings.some((g) => lowerInput.includes(g)) || lowerInput.length < 4) {
    return {
      response: getRandomResponse("greeting"),
      isEmergency: false,
    }
  }

  const keywordMatches: string[] = []
  const excludeKeys = [
    "greeting",
    "fallback",
    "emergency",
    "what",
    "how",
    "why",
    "help",
    "thank",
    "bye",
    "okay",
    "yes",
    "no",
  ]

  for (const key of Object.keys(RESPONSES)) {
    if (!excludeKeys.includes(key) && lowerInput.includes(key)) {
      keywordMatches.push(key)
    }
  }

  // Check for question words if no medical keywords found
  if (keywordMatches.length === 0) {
    const questionWords = ["what", "how", "why", "help", "thank", "bye", "okay", "yes", "no"]
    for (const word of questionWords) {
      if (lowerInput.includes(word)) {
        return {
          response: getRandomResponse(word),
          isEmergency: false,
        }
      }
    }
  }

  // Return response for matching keywords
  if (keywordMatches.length > 0) {
    // Prioritize more specific matches (longer keywords)
    keywordMatches.sort((a, b) => b.length - a.length)
    const matchedKey = keywordMatches[0]
    return {
      response: getRandomResponse(matchedKey),
      isEmergency: false,
    }
  }

  return {
    response: getRandomResponse("fallback"),
    isEmergency: false,
  }
}

export function ArodocChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<InstanceType<SpeechRecognitionType> | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input.trim()
    setInput("")
    setIsTyping(true)

    const typingDelay = 1000 + Math.random() * 1000

    setTimeout(() => {
      const { response, isEmergency } = getKeywordResponse(userInput)

      if (isEmergency) {
        setShowEmergencyBanner(true)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        isEmergency,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, typingDelay)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickSuggestions = [
    "I have a headache",
    "Feeling tired lately",
    "Tips for better sleep",
    "How to reduce stress?",
  ]

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header - improved with shadow and better spacing */}
      <div className="flex items-center gap-3 border-b border-border/50 bg-card/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
          <Bot className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground text-lg">Arodoc AI</h2>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Medical Disclaimer - better styling with rounded corners */}
      <div className="flex items-center gap-2 bg-amber-50/80 backdrop-blur-sm mx-4 mt-3 px-4 py-2.5 rounded-lg text-xs text-amber-700 border border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800/30">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <p>
          This AI is for informational purposes only. It does NOT replace professional medical advice. Always consult a
          certified doctor.
        </p>
      </div>

      {/* Emergency Banner - enhanced styling */}
      {showEmergencyBanner && (
        <div className="flex items-center justify-between bg-gradient-to-r from-destructive to-destructive/90 mx-4 mt-3 px-4 py-3 rounded-lg text-destructive-foreground shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-semibold">Emergency detected! Call 108 immediately if needed.</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-destructive-foreground hover:bg-white/20 rounded-md"
            onClick={() => setShowEmergencyBanner(false)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Messages - improved padding and spacing */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 shadow-inner">
              <Bot className="h-10 w-10 text-primary/70" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">How can I help you today?</h3>
            <p className="mb-8 max-w-md text-sm text-muted-foreground leading-relaxed">
              I can analyze your symptoms, suggest diet plans, or explain your medical reports.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/30 rounded-full px-4 py-2 h-auto transition-all duration-200 shadow-sm"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md"
                      : message.isEmergency
                        ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-md"
                        : "bg-card text-foreground border border-border/50 rounded-bl-md",
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      "mt-2 text-[10px] opacity-70",
                      message.role === "user" ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in-0 duration-200">
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="rounded-2xl rounded-bl-md bg-card border border-border/50 px-5 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.3s]"></span>
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.15s]"></span>
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/40"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input - Modern input styling with better shadows */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm p-4 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your symptoms or health query..."
              className="w-full rounded-full border border-border/50 bg-background px-5 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all duration-200"
              disabled={isTyping}
            />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full transition-colors duration-200",
                isListening ? "bg-destructive text-destructive-foreground" : "hover:bg-muted",
              )}
              onClick={toggleListening}
              disabled={isTyping}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-muted-foreground" />}
            </Button>
          </div>
          <Button
            size="icon"
            className="h-11 w-11 rounded-full shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-primary to-primary/90"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
