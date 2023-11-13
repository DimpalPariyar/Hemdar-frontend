import { Accordion, AccordionSummary, Typography, AccordionDetails, Button, Divider, Tooltip } from '@mui/material';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, useTheme } from '@mui/system';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';

const FaqList = () => {
  const theme = useTheme();
  const [faqList, setFaqList] = useState<any>([]);

  const getFaqList = () =>
    axios.get(`${BASE_URL}/faq`).then((response) => {
      setFaqList(response.data);
    });

  const deleteTopic = (topicId: string) => axios.delete(`${BASE_URL}/faq/${topicId}`).then(getFaqList);

  // const deleteArticle = (topicId: string) => axios.delete(`${BASE_URL}/faq/${topicId}`).then(getFaqList);

  useEffect(() => {
    getFaqList();
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="flex-end">
        <Button sx={{ position: 'absolute', top: 0 }} href={`/faq-create`} variant="contained" color="primary">
          Create Faq
        </Button>
      </Box>
      {faqList.map((faq: any) => (
        <Box key={faq.topicId} sx={{ marginTop: 2, borderLeft: '4px solid gray' }} component={Accordion}>
          <AccordionSummary sx={{ alignItems: 'center' }} expandIcon={<ExpandMoreIcon />}>
            <Box pt={1} py={2} flex={1} display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" fontWeight="500">
                  {faq.topicTitle}
                </Typography>
                -<Typography variant="h6">{faq.topicDescription}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Edit">
                  <Button href={`/faq-edit/${faq._id}`} startIcon={<EditTwoTone />}>
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    color="error"
                    startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}
                    onClick={() => deleteTopic(faq._id)}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {faq.articles.map((article: any, i: number) => (
              <>
                <Box key={article.articleId} flex={1} py={2} pl={2} display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="h6">{article.articleTitle}</Typography>
                    <Typography variant="h4">
                      <span dangerouslySetInnerHTML={{ __html: article.articleBlogHTML }} />
                    </Typography>
                  </Box>
                  {/*<div>*/}
                  {/*  <Tooltip title="Delete">*/}
                  {/*    <Button*/}
                  {/*      color="error"*/}
                  {/*      startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}*/}
                  {/*      onClick={() => deleteArticle(faq._id)}*/}
                  {/*    >*/}
                  {/*      Delete*/}
                  {/*    </Button>*/}
                  {/*  </Tooltip>*/}
                  {/*</div>*/}
                </Box>
                {i + 1 !== faq.articles.length && <Divider />}
              </>
            ))}
          </AccordionDetails>
        </Box>
      ))}
    </Box>
  );
};
export default FaqList;
