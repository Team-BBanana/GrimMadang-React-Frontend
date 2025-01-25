import { useState, useEffect } from 'react';

interface Metadata {
  guidelines?: string | any[];
  topic?: string;
  imageUrl?: string;
}

interface ParsedData {
  instructions: string[];
  topic: string;
  title: string[];
  imageUrl: string;
}

export const useMetadataParser = (metadata: Metadata | null) => {
  const [instructions, setInstructions] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [title, setTitle] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (metadata) {
      console.log('Received metadata:', metadata);
      try {
        // guidelines 파싱
        let parsedInstructions: string[] = [];
        let parsedTitle: string[] = [];
        
        if (metadata.guidelines) {
          const guidelinesArray = typeof metadata.guidelines === 'string' 
            ? JSON.parse(metadata.guidelines) 
            : metadata.guidelines;
            
          parsedInstructions = guidelinesArray.map((item: any) => item.instruction);
          parsedTitle = guidelinesArray.map((item: any) => item.title);
        }

        // topic과 imageUrl 파싱
        const parsedTopic = metadata.topic || '';
        const parsedImageUrl = metadata.imageUrl || '';

        console.log('Parsed data:', {
          instructions: parsedInstructions,
          topic: parsedTopic,
          title: parsedTitle,
          imageUrl: parsedImageUrl
        });

        // 상태 업데이트
        setInstructions(parsedInstructions);
        setTopic(parsedTopic);
        setTitle(parsedTitle);
        setImageUrl(parsedImageUrl);
      } catch (error) {
        console.error('Error parsing metadata:', error, metadata);
      }
    }
  }, [metadata]);

  return {
    instructions,
    topic,
    title,
    imageUrl
  };
}; 