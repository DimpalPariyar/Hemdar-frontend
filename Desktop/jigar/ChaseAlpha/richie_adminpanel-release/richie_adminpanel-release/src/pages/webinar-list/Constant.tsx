import { format } from 'date-fns';
import { IconButton, Link, Tooltip } from '@mui/material'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TooltipActioinCard from './TooltipActioinCard';
export const columns = [
    {
        Header: 'Date',
        disableFilters: true,
        accessor: ({ webinarTime }: any) => (webinarTime ? format(new Date(webinarTime), 'dd MMM yyyy') : 'NA')
    },
    {
        Header: 'Time',
        disableFilters: true,
        accessor: ({ webinarTime }: any) => (webinarTime ? format(new Date(webinarTime), 'HH:mm') : 'NA')
    }, {
        Header: 'Title',
        accessor: ({ title }: any) => title || '-'
    },
    {
        Header: 'Description',
        accessor: ({ longDescription }: any) => longDescription || '-'
    },
    {
        Header: "Host Profile id",
        accessor: ({ hostProfileId }: any) => hostProfileId || "-"
    },
    {
        Header: 'Link',
        accessor: ({ linkIds }: any) => linkIds || '-',
        Cell: ({ value }: any) => {
            return (
                <Link href="https://richie.club/">
                    {value}
                </Link>
            );
        }
    },
    {
        Header: 'Actions',
        className: 'cell-right',
        accessor: '_id',
        disableSortBy: true,
        Cell: ({ value }: any) => {
            return (
                <Link>
                    <Tooltip componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#FFFFFF',
                                '& .MuiTooltip-arrow': {
                                    color: '#FFFFFF',
                                },
                            },
                        },
                    }} arrow placement="top-end" title={<TooltipActioinCard value={value} />}>
                        <IconButton color="secondary">
                            <MoreHorizIcon />
                        </IconButton>
                    </Tooltip>
                </Link>
            );
        }
    }
]
