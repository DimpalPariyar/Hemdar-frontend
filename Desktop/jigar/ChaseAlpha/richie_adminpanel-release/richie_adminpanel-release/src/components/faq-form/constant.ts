export const firstFormSet = [
  { name: 'topicTitle', label: 'Title' },
  { name: 'topicDescription', label: 'Topic Description' }
];

export const defaultArticle = {
  articleTitle: '',
  articleBlogHTML: ''
};

export const initialValues = {
  topicTitle: '',
  topicDescription: '',
  articles: [defaultArticle]
};

export const articleFormSet = [
  { name: 'articleTitle', label: 'Article Title', textProps: {} },
  { name: 'articleBlogHTML', label: 'Article Summary', textProps: { multiline: true, rows: 4, sx: { width: 600 } } }
];
