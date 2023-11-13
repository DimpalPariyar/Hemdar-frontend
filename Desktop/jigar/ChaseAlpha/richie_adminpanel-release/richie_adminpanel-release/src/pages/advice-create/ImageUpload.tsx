import { DeleteTwoTone } from '@ant-design/icons';
import { Button, Tooltip, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const thumbsContainer: any = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb: any = {
  display: 'inline-flex',
  borderRadius: 2,
  flexDirection: 'column',
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 180,
  height: 180,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner: any = {
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden'
};

const img: any = {
  display: 'block',
  width: 'auto',
  height: 'auto',
  marginBottom: 4
};

export default function ImageUpload({ name, formik }: any) {
  const theme = useTheme();
  let files: any;
  if (typeof formik.values[name] === 'string') {
    files = [];
  } else {
    files = formik.values[name] || [];
  }

  const setFiles = (values: any) => {
    formik.setFieldValue(name, values);
  };

  const onDrop = (acceptedFiles: any) =>
    setFiles(
      acceptedFiles.map((file: any) => {
        return { ...file, file, preview: URL.createObjectURL(file) };
      })
    );

  const removeFile = (index: number) => {
    const items: any = [...files];
    items.splice(index, 1);
    setFiles(items);
  };

  const handlePaste = (e: any) => {
    if (e.clipboardData.files.length) {
      const fileObject = e.clipboardData.files[0];
      onDrop([fileObject]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop,
    multiple: false
  });

  const thumbs = files.map((file: any, i: number) => (
    <div style={thumb} key={file.name}>
      <Box style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          alt="no files"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </Box>
      <Tooltip title="Delete">
        <Button onClick={() => removeFile(i)} color="error" startIcon={<DeleteTwoTone twoToneColor={theme.palette.error.main} />}>
          Delete
        </Button>
      </Tooltip>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Box display="flex" mt={0.5} flexDirection="column">
      <Box width={300} height={50} onPaste={handlePaste} style={{ border: '1px dashed #2D00D2', borderRadius: 20 }}>
        <Box m={1.1} borderRadius={1} {...getRootProps()}>
          <input {...getInputProps()} />
          <Typography sx={{ cursor: 'pointer' }} textAlign="center">
            Paste or Drag 'n' drop or click to select files
          </Typography>
        </Box>
      </Box>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </Box>
  );
}
