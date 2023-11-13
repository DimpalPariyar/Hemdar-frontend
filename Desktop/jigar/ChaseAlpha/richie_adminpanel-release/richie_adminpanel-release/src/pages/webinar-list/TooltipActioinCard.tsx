import React from 'react'
import Button from '@mui/material/Button';
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { openSnackbar } from '../../store/reducers/snackbar';
import { getWebinars } from '../../store/reducers/webinars';
import { useDispatch } from '../../store';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Tooltip } from '@mui/material';

interface ValueProps {
    value: any
}

const TooltipActioinCard = ({ value }: ValueProps) => {
    const dispatch = useDispatch()
    const handleDeleteProduct = (value: string) => {
        axios.delete(`${BASE_URL}/learning/webinar/${value}`).then(async () => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Product is deleted successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true
                })
            );
            dispatch(getWebinars());
        })
    }
    return (
        <>
            <Tooltip title="view">
                <Button href={`advisory-detail/${value}`} >
                    <EyeTwoTone />
                </Button>
            </Tooltip>
            <Tooltip title="Edit">
                <Button
                    href={`webinar-edit/${value}`}
                    color="primary"
                    size="small"
                    startIcon={<EditTwoTone />}
                >
                </Button>
            </Tooltip>
            <Tooltip title="Delete">
                <Button
                    color="error"
                    size="small"
                    startIcon={<DeleteTwoTone />}
                    onClick={() => handleDeleteProduct(value)}
                >
                </Button>
            </Tooltip>
        </>
    )
}

export default TooltipActioinCard