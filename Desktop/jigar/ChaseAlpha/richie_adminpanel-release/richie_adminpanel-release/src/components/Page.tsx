import { forwardRef, ReactNode, Ref } from 'react';

// material-ui
import { Box, BoxProps } from '@mui/material';

// ==============================|| Page - SET TITLE & META TAGS ||============================== //

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, Props>(({ children, title = '', meta, ...other }: Props, ref: Ref<HTMLDivElement>) => (
  <>
    <h1>
      <title>{`${title} | Mantis React Admin`}</title>
      {meta}
    </h1>

    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

export default Page;
