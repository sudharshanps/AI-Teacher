// Voice synthesis utility with Web Speech API
export function speakText(
  text: string, 
  language: string = 'English', 
  onStart?: () => void, 
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Clear academic pacing
  utterance.pitch = 1.05;

  // Language mapping
  const langMap: Record<string, string> = {
    English: 'en-US',
    Hindi: 'hi-IN',
    Tamil: 'ta-IN',
    Telugu: 'te-IN',
    Malayalam: 'ml-IN',
    Kannada: 'kn-IN',
    Hinglish: 'hi-IN',
  };

  utterance.lang = langMap[language] || 'en-US';

  // Attempt to select a natural voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2))) || voices[0];
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
