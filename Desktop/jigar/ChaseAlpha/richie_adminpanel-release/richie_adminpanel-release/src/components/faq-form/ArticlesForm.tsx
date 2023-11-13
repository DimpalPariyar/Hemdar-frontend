// material-ui
import { Button, Typography, FormControl, InputLabel, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { FormikProvider, FieldArray } from 'formik';
import { defaultArticle, articleFormSet } from './constant';
import FastInputField from '../FastInputField';

const ArticlesForm = ({ formik }: any) => {
  const { values } = formik;

  function gettextareaStyle(field: string) {
    return field === "Article Summary" ? {
      bgcolor: "#ECEFFF", borderRadius: 10, padding: '8px 10px', "&:hover": {
        border: "1px solid #2D00D2"
      }
    } : {}
  }

  const FastinputfieldStyle = {
    bgcolor: "#ECEFFF", borderRadius: "10px", padding: '8px 10px', "&:hover": {
      border: "1px solid #2D00D2"
    }
  }

  return (
    <Stack direction="column" flex={1} gap={1} marginY={2}>
      <FormikProvider value={formik}>
        <FieldArray
          name="articles"
          render={(arrayHelpers) => {
            return (
              <Stack flexDirection="column">
                {values.articles.map((article: any, index: any) => {
                  return (
                    <>
                      <Box display="flex" key={index} my={2} mb={3} justifyContent="space-between">
                        <Typography variant="h4">{`Articles - ${article.articleTitle || index + 1}`}</Typography>
                        <Button variant="contained" color="error" onClick={() => arrayHelpers.remove(index)}>
                          Delete
                        </Button>
                      </Box>
                      <Box display="flex" gap={3} flexDirection="column">
                        {articleFormSet.map((field: any) => {
                          return (
                            <Stack key={field.name} spacing={1} width={340}>
                              <InputLabel sx={{ mt: 1 }}>{field.label}</InputLabel>
                              <FormControl

                                sx={gettextareaStyle(field.label)}
                              >
                                <FastInputField
                                  style={FastinputfieldStyle}
                                  type={field.type}
                                  value={article[field.name]}
                                  onChange={formik.setFieldValue}
                                  disabled={field.disabled}
                                  name={`articles[${index}].${field.name}`}
                                  {...field.textProps}
                                />
                              </FormControl>
                            </Stack>
                          );
                        })}
                      </Box>
                    </>
                  );
                })}
                <Box
                  component="span"
                  onClick={() => arrayHelpers.push(defaultArticle)}
                  borderRadius={2}
                  my={3}
                  mt={5}
                  sx={{ p: 2, border: '1px dashed grey', cursor: 'pointer' }}
                >
                  <Typography variant="h4" textAlign="center">
                    Add New Article
                  </Typography>
                </Box>
              </Stack>
            );
          }}
        />
      </FormikProvider>
    </Stack>
  );
};

export default ArticlesForm;
