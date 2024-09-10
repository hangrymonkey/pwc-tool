import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Function to convert simple markdown to docx elements
const parseMarkdownToDocx = (markdown: string): Paragraph[] => {
  const lines = markdown.split('\n');
  const docxElements: Paragraph[] = [];

  lines.forEach(line => {
    let paragraph: Paragraph;
    
    // Handle heading 1 (H1)
    if (line.startsWith('# ')) {
      paragraph = new Paragraph({
        text: line.replace('# ', ''),
        heading: 'Heading1',
      });
    }
    // Handle heading 2 (H2)
    else if (line.startsWith('## ')) {
      paragraph = new Paragraph({
        text: line.replace('## ', ''),
        heading: 'Heading2',
      });
    }

    // Handle heading 3 (H3)
    else if (line.startsWith('### ')) {
      paragraph = new Paragraph({
        text: line.replace('### ', ''),
        heading: 'Heading3',
      });
    }

    // Handle heading 4 (H4)
    else if (line.startsWith('#### ')) {
      paragraph = new Paragraph({
        text: line.replace('#### ', ''),
        heading: 'Heading4',
      });
    }


    // Handle bold (**bold**)
    else if (line.includes('**')) {
      const textParts = line.split('**');
      const children = textParts.map((part, index) => {
        if (index % 2 === 1) {
          // Bold text
          return new TextRun({ text: part, bold: true });
        }
        return new TextRun(part);
      });
      paragraph = new Paragraph({ children });
    }
    // Handle italic (*italic*)
    else if (line.includes('*')) {
      const textParts = line.split('*');
      const children = textParts.map((part, index) => {
        if (index % 2 === 1) {
          // Italic text
          return new TextRun({ text: part, italics: true });
        }
        return new TextRun(part);
      });
      paragraph = new Paragraph({ children });
    }
    // Handle normal text
    else {
      paragraph = new Paragraph(line);
    }

    docxElements.push(paragraph);
  });

  return docxElements;
};

// Function to export the markdown content as DOCX
export const exportMarkdownToDocx = async (markdownContent: string) => {
  // Parse the markdown content and convert it to docx format
  const docxContent = parseMarkdownToDocx(markdownContent);

  // Initialize the document with a section
  const doc = new Document({
    sections: [
      {
        children: docxContent,
      },
    ],
  });

  // Generate the DOCX file as a Blob
  const blob = await Packer.toBlob(doc);

  // Save the file using file-saver
  saveAs(blob, 'analysis.docx');
};