import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/system';
import Loader from 'components/Loader';
import BasicTable from 'components/react-table/BasicTable';
import ScrollX from 'components/ScrollX';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button, FormControlLabel, IconButton, Stack, Switch, TextField, Tooltip } from '@mui/material';
import { DeleteTwoTone, SendOutlined } from '@ant-design/icons';
import { openSnackbar } from 'store/reducers/snackbar';

const columns = (deleteQuestion: any) => [
  {
    Header: 'Date',
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'Time',
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'HH:mm') : 'NA')
  },
  {
    Header: 'Questions',
    accessor: 'question'
  },
  {
    Header: 'Questioner',
    accessor: 'name'
  },
  {
    Header: 'Answer',
    accessor: 'answer'
  },
  {
    Header: 'Actions',
    className: 'cell-right',
    accessor: '_id',
    disableSortBy: true,
    Cell: ({ value }: any) => {
      return (
        <Stack alignItems="center">
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteQuestion(value)} color="error">
              <DeleteTwoTone />
            </IconButton>
          </Tooltip>
        </Stack>
      );
    }
  }
];

function QuestionAnswerList() {
  const { id = '' } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<any>();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAnsweredData, setShowAnsweredData] = useState(false);
  const [answer, setAnswer] = useState('');
  const [questionId, setQuestionId] = useState();

  const getQuestion = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/question?sessionId=${id}`);
      setQuestions(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const submitAnswer = async () => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/learning/answer`, { questionId, answer });
      setAnswer('');
    } catch (error) {
      console.log(error);
    } finally {
      getQuestion();
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/learning/question/${id}`);
      getQuestion();
      dispatch(
        openSnackbar({
          open: true,
          message: 'Question is deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const answeredQuestion = (questions || []).filter(({ answer }: any) => !Boolean(answer));

  const questionData = showAnsweredData ? answeredQuestion : questions;

  useEffect(() => {
    getQuestion();
  }, []);

  if (!questions || loading) {
    return <Loader />;
  }

  return (
    <Box display="flex" flexDirection="column">
      <ScrollX>
        <Stack alignItems="flex-end" px={2} pb={2}>
          <FormControlLabel
            onChange={() => setShowAnsweredData(!showAnsweredData)}
            value="start"
            control={<Switch color="primary" />}
            label="Show Questions not Answered"
            labelPlacement="start"
          />
        </Stack>
        <BasicTable
          onRowClick={(data: any) => setQuestionId(data._id)}
          columns={columns(deleteQuestion)}
          data={questionData}
          striped
          disableFilters
        />
      </ScrollX>
      <Stack alignItems="cemter" flexDirection="row" gap={2} mt={2}>
        <TextField fullWidth value={answer} onChange={(e: any) => setAnswer(e.target.value)} />
        <Button
          disabled={loading || !answer || !questionId}
          variant="contained"
          startIcon={<SendOutlined />}
          size="large"
          onClick={submitAnswer}
        >
          Send
        </Button>
      </Stack>
    </Box>
  );
}

export default QuestionAnswerList;
