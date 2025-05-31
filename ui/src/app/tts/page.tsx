import TextToSpeech from '../components/TextToSpeech';

export default function TextToSpeechPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Text to Speech Converter</h1>
        <TextToSpeech />
      </div>
    </div>
  );
} 