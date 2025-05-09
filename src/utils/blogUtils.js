/**
 * Blog Utility Functions
 * Provides helper functions for blog post rendering and processing
 */

/**
 * Calculates the estimated reading time of content
 * @param {string} content - The blog post content
 * @param {number} wordsPerMinute - Reading speed, defaults to 200 wpm
 * @returns {number} Reading time in minutes (minimum 1 minute)
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return 1;
  
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTimeMinutes);
};

/**
 * Extracts hashtags from content
 * @param {string} content - The blog post content
 * @param {number} limit - Maximum number of tags to return
 * @returns {string[]} Array of tag strings without # symbol
 */
export const extractTags = (content, limit = 5) => {
  if (!content) return ['Blog'];
  
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  
  if (matches) {
    return matches
      .map(tag => tag.substring(1))
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, limit);
  }
  
  return ['Blog'];
};

/**
 * Enhanced Markdown processor
 * @param {string} text - Markdown text to process
 * @returns {string} Processed HTML
 */
export const processMarkdown = (text) => {
  if (!text) return '';
  
  let processed = text;
  
  // Handle headings
  processed = processed.replace(/^#{1,6}\s+(.+)$/gm, (match, content, level) => {
    const count = match.match(/^#+/)[0].length;
    return `<h${count}>${content}</h${count}>`;
  });
  
  // Handle bold
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Handle links
  processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Handle inline code
  processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle blockquotes
  processed = processed.replace(/^>\s(.+)/gm, '<blockquote>$1</blockquote>');
  
  // Handle lists
  processed = processed.replace(/^\s*[\-\*]\s+(.+)/gm, '<li>$1</li>');
  processed = processed.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  // Handle numbered lists
  processed = processed.replace(/^\s*\d+\.\s+(.+)/gm, '<li>$1</li>');
  processed = processed.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
  
  return processed;
};

/**
 * Creates optimized image sources for responsive loading
 * @param {string} src - Original image URL
 * @returns {Object} Object with srcset and sizes for responsive images
 */
export const getOptimizedImageSources = (src) => {
  // Check if URL is from common CDNs that support responsive images
  if (!src) return { src };
  
  // Check if it's an IPFS image (common in Hive)
  if (src.includes('ipfs')) {
    return { 
      src,
      loading: 'lazy'
    };
  }
  
  // For images from services that support image resizing
  if (src.includes('cloudinary.com') || src.includes('imgix.net') || src.includes('images.hive.blog')) {
    return {
      src,
      srcSet: `${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`,
      sizes: '(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px',
      loading: 'lazy'
    };
  }
  
  // Default fallback
  return { src, loading: 'lazy' };
};

/**
 * Processes a blog to identify and enhance embedded content
 * @param {string} content - Full blog content
 * @returns {Array} Array of content sections with type and data
 */
export const processBlogContent = (content) => {
  if (!content) return [];
  
  const sections = [];
  const lines = content.split('\n');
  let currentParagraph = '';
  
  const addParagraph = (text) => {
    if (text.trim()) {
      sections.push({
        type: 'paragraph',
        content: processMarkdown(text.trim())
      });
    }
  };

  // Process content line by line with proper image positioning
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Handle headers
    if (line.startsWith('#')) {
      addParagraph(currentParagraph);
      currentParagraph = '';
      
      const level = line.match(/^#+/)[0].length;
      const title = line.replace(/^#+\s*/, '');
      
      sections.push({
        type: 'heading',
        level,
        content: processMarkdown(title)
      });
      continue;
    }
    
    // Handle horizontal rules
    if (line.match(/^-{3,}$/) || line.match(/^\*{3,}$/)) {
      addParagraph(currentParagraph);
      currentParagraph = '';
      sections.push({ type: 'divider' });
      continue;
    }
    
    // Handle images - add them in place rather than grouping
    const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
    if (imageMatch) {
      // Add any paragraph text before this image
      addParagraph(currentParagraph);
      currentParagraph = '';
      
      // Add the image directly to the section
      sections.push({
        type: 'imageGroup',
        images: [{
          alt: imageMatch[1],
          url: imageMatch[2]
        }]
      });
      continue;
    }
    
    // Handle multiple images in consecutive lines
    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      const nextImageMatch = nextLine.match(/!\[(.*?)\]\((.*?)\)/);
      
      if (imageMatch && nextImageMatch) {
        const images = [];
        
        // Add first image
        images.push({
          alt: imageMatch[1],
          url: imageMatch[2]
        });
        
        // Add subsequent images as long as they follow consecutively
        let j = i + 1;
        while (j < lines.length) {
          const checkLine = lines[j].trim();
          const checkMatch = checkLine.match(/!\[(.*?)\]\((.*?)\)/);
          
          if (checkMatch) {
            images.push({
              alt: checkMatch[1],
              url: checkMatch[2]
            });
            j++;
            i = j - 1; // Update outer loop counter
          } else {
            break;
          }
        }
        
        sections.push({
          type: 'imageGroup',
          images
        });
        continue;
      }
    }
    
    // Handle YouTube or other embeds
    if (line.startsWith('<iframe') || line.includes('<iframe')) {
      addParagraph(currentParagraph);
      currentParagraph = '';
      
      sections.push({
        type: 'iframe',
        content: line
      });
      continue;
    }
    
    // Accumulate paragraph text
    if (line !== '') {
      currentParagraph += (currentParagraph ? ' ' : '') + line;
    } else if (currentParagraph) {
      addParagraph(currentParagraph);
      currentParagraph = '';
    }
  }
  
  // Add any remaining content
  addParagraph(currentParagraph);
  
  return sections;
};

/**
 * Formats a date in a human-readable form
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Generates a placeholder avatar for a username
 * @param {string} username - Username to generate avatar for
 * @returns {Object} Avatar properties
 */
export const generateAvatar = (username) => {
  if (!username) return { 
    letter: 'A',
    color: '#3563E9'
  };
  
  const colors = [
    '#3563E9', // primary
    '#8098F9', // secondary
    '#2E8B57', // forest green
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#EF4444', // red
  ];
  
  // Generate a consistent color based on username
  const colorIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  return {
    letter: username.charAt(0).toUpperCase(),
    color: colors[colorIndex]
  };
}; 