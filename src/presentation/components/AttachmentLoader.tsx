/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
// import * as _ from 'lodash';
import { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';

// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// modal
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import Slider from 'react-slick';
import { v4 as uuid } from 'uuid';

const previewModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  height: 'auto',
  maxWidth: '90%',
  maxHeight: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 0,
};
const AttachmentLoader = (props: any) => {
  const attachments = props.attachments;

  const setAttachments = props.setAttachments;
  const deletedRegedAttach = props.deletedRegedAttach;
  const setDeletedRegedAttach = props.setDeletedRegedAttach;
  const imgPerSlide = props.imgPerSlide;

  // const [attachments, setAttachments] = useState([]);
  // const [boole, setBoole] = useState(true);
  const [previwModalOpen, setPreviwModalOpen] = useState(false);
  const [prevImg, setPrevImg] = useState('');
  // const sliderRef = useRef(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreviwModalClose = () => {
    console.log('preview modal closed');
    setPreviwModalOpen(false);
  };

  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: imgPerSlide,
    slidesToScroll: 1,
    centerMode: false,
    // centerPadding: '0 50px',
    // initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          // initialSlide: 2
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // for (let i = 0; i < attachments.length; i++) {
  //     if (attachments[i].){}

  // }

  const fileToDataUri = (file: any) => {
    return new Promise((res) => {
      const reader = new FileReader();
      const { name } = file;

      const fileExtension = name
        .substr(name.lastIndexOf('.') + 1)
        .toLowerCase();
      // let fileExtension = name.split('.').pop()
      let fileThumbnail = '';
      let downloadable = true;

      if (
        fileExtension === 'jpg' ||
        fileExtension === 'jpeg' ||
        fileExtension === 'png' ||
        fileExtension === 'gif'
      ) {
        downloadable = false;
      } else if (
        fileExtension === 'mp4' ||
        fileExtension === 'webm' ||
        fileExtension === 'mkv' ||
        fileExtension === 'wmv'
      ) {
        fileThumbnail = 'https://i.ibb.co/cNLBwjY/Video-File-Icon.png';
        downloadable = true;
      } else if (
        fileExtension === 'xlsx' ||
        fileExtension === 'xls' ||
        fileExtension === 'csv'
      ) {
        fileThumbnail = 'https://i.ibb.co/5THHDGH/Excel-File-Icon-svg.png';
        downloadable = true;
      } else if (
        fileExtension === 'doc' ||
        fileExtension === 'docx' ||
        fileExtension === 'dot' ||
        fileExtension === 'dotx'
      ) {
        fileThumbnail = 'https://i.ibb.co/Z219ZB3/Word-File-Icon.png';
        downloadable = true;
      } else if (fileExtension === 'pdf') {
        fileThumbnail = 'https://i.ibb.co/b5Dq1Q3/Pdf-File-Icon-svg.png';
        downloadable = true;
      } else {
        fileThumbnail = 'https://i.ibb.co/hsnss8w/general-File-Icon.png';
        downloadable = true;
      }

      reader.addEventListener('load', () => {
        res({
          fileB64format: reader.result,
          fileName: name,
          fileExtension,
          fileThumbnail,
          downloadable,
        });
      });
      reader.readAsDataURL(file);
    });
  };

  const attachmentsChanged = async (e: any) => {
    const fileList = e.target.files;
    console.log(fileList);
    // let allAttachments = _.cloneDeep(attachments);
    if (fileList && fileList.length > 0) {
      const newFilesPromises = [];
      for (let i = 0; i < e.target.files.length; i += 1) {
        newFilesPromises.push(fileToDataUri(fileList[i]));
      }
      const newFiles = await Promise.all(newFilesPromises);
      setAttachments([...newFiles, ...attachments]);
      // alert('Hello rupom');
      console.log('Hello rupom');
      console.log(attachments);
      // Clear the file input value
      if (fileInputRef?.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  // const checkAndSetAttachObjFomrat = (perAttachment) => {
  //     let fileExtension = perAttachment.AttachmentType;
  //     // let fileExtension = name.split('.').pop()
  //     let fileThumbnail = '';
  //     let downloadable = true;

  //     if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png' || fileExtension == 'gif') {
  //         downloadable = false;
  //     }
  //     else if (fileExtension == 'mp4' || fileExtension == 'webm' || fileExtension == 'mkv' || fileExtension == 'wmv') {
  //         fileThumbnail = "https://i.ibb.co/cNLBwjY/Video-File-Icon.png";
  //         downloadable = true;
  //     }
  //     else if (fileExtension == 'xlsx' || fileExtension == 'xls' || fileExtension == 'csv') {
  //         fileThumbnail = "https://i.ibb.co/5THHDGH/Excel-File-Icon-svg.png";
  //         downloadable = true;
  //     }
  //     else if (fileExtension == 'doc' || fileExtension == 'docx' || fileExtension == 'dot' || fileExtension == 'dotx') {
  //         fileThumbnail = "https://i.ibb.co/Z219ZB3/Word-File-Icon.png";
  //         downloadable = true;
  //     }
  //     else if (fileExtension == 'pdf') {
  //         fileThumbnail = "https://i.ibb.co/b5Dq1Q3/Pdf-File-Icon-svg.png";
  //         downloadable = true;
  //     }
  //     else {
  //         fileThumbnail = "https://i.ibb.co/hsnss8w/general-File-Icon.png";
  //         downloadable = true;
  //     }
  //     let attachmentObjFormat = {
  //         autoSL: perAttachment.AutoSL,
  //         fileB64format: perAttachment.AttachmentURL,
  //         fileName: perAttachment.FileName,
  //         fileExtension: perAttachment.AttachmentType,
  //         fileThumbnail: perAttachment.AttachmentURL,
  //         downloadable: downloadable
  //     }
  //     return attachmentObjFormat;
  // }

  const previewFile = (e: any) => {
    console.log('prev file');
    setPrevImg(e.target.currentSrc);
    setPreviwModalOpen(true);
  };

  const downloadFile = (e: any) => {
    const win = window.open();
    win?.document.write(
      `<iframe src="${e.target.getAttribute(
        'data-fileb64'
      )}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
    );

    // window.location = e.target.getAttribute('data-fileb64');
    // console.log(e.target.getAttribute('data-fileb64'));
  };

  const deleteFile = (index: any) => {
    // const allAttachments = _.cloneDeep(attachments);

    const allAttachments = JSON.parse(JSON.stringify(attachments));

    console.log('whole array b4 delete:');
    console.log(allAttachments);
    console.log('index no. deleted:');
    console.log(index);
    if (allAttachments[index].primaryKey) {
      // alert('dhuksi kintu');

      setDeletedRegedAttach([
        ...deletedRegedAttach,
        {
          primaryKey: allAttachments[index].primaryKey,
          fileName: allAttachments[index].fileName,
        },
      ]);
    }
    allAttachments.splice(index, 1);
    console.log('after delete');
    console.log(allAttachments);
    setAttachments(allAttachments);
    console.log('deleted items array-->');
    console.log(deletedRegedAttach);
  };
  return (
    <div className="">
      {/* <h2> Responsive </h2> */}
      <div className="relative -ml-[10px] -mb-[10px] z-[1] flex justify-start">
        <input
          type="file"
          id="fileAttachInput"
          multiple
          onChange={attachmentsChanged}
          ref={fileInputRef}
          hidden
        />
        {attachments.length ? (
          <Tooltip title="Attach File" arrow style={{ zIndex: 10000001 }}>
            {/* <label
              htmlFor="fileAttachInput"
              id="attachmentLabel"
              className="inline-block px-[6px] py-1 bg-slate-500 text-white font-medium text-xs leading-tight rounded-full shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
            >
              <i className="fas fa-plus" />
            </label> */}
            <label
              htmlFor="fileAttachInput"
              id="attachmentLabel"
              className="inline-block px-[6px] py-1 bg-slate-500 text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out "
            >
              <i className="fas fa-plus" />{' '}
              <span className="hidden group-hover:inline transform-all duration-150 ease-in-out">
                Attach More
              </span>
            </label>
          </Tooltip>
        ) : (
          <label
            htmlFor="fileAttachInput"
            id="attachmentLabel"
            className="inline-block px-[6px] py-1 bg-slate-500 text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out "
          >
            <i className="fas fa-plus" /> Attach Files
          </label>
        )}
      </div>

      {attachments.length ? (
        <Slider
          {...settings}
          className="pt-2 pb-1 px-1 border-1 rounded border-zinc-300 min-h-[25%]"
        >
          {attachments.map((perAttachment: any, index: any) => (
            <div
              key={uuid()}
              className="border-x-4 border-transparent hover:scale-[1.06] active:translate-y-0 transform-all ease-in-out duration-700"
            >
              <div className="flex">
                {/* <img src={(perAttachment.downloadable) ? perAttachment.fileThumbnail : perAttachment.fileB64format}  */}
                <img
                  style={{ objectPosition: 'top' }} // to show cropped preview image from top side
                  src={
                    perAttachment.downloadable
                      ? perAttachment.fileThumbnail
                      : perAttachment.fileB64format
                  }
                  data-fileb64={
                    perAttachment.downloadable
                      ? perAttachment.fileB64format
                      : ''
                  }
                  className="rounded-t-md border-t-2 border-x-2 border-zinc-300 cursor-zoom-in object-cover w-full h-20"
                  alt=""
                  onClick={
                    perAttachment.downloadable ? downloadFile : previewFile
                  }
                />

                <div className="-mt-[3px] mr-[0px] -ml-[17px]">
                  <Tooltip title="Delete" arrow style={{ zIndex: 10000001 }}>
                    <i
                      role="button"
                      tabIndex={0}
                      className="fas fa-times p-[2px] py-[0px] text-[12px] rounded-sm bg-opacity-50 bg-gray-100 text-rose-700 hover:bg-opacity-90 cursor-pointer hover:scale-110 hover:text-gray-100 hover:bg-rose-600 transform-all duration-150 ease-in-out"
                      onClick={() => deleteFile(index)}
                    />
                  </Tooltip>
                </div>
              </div>

              <Tooltip
                title={perAttachment.fileName}
                arrow
                style={{ zIndex: 10000001 }}
              >
                <p className="px-[5px] truncate text-sm bg-zinc-300 cursor-help rounded-b-md text-center">
                  {perAttachment.fileName}
                </p>
              </Tooltip>
            </div>
          ))}
        </Slider>
      ) : (
        <Slider
          {...settings}
          className=" py-[59px] border-1 rounded border-zinc-300 min-h-[25%]"
        />
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={previwModalOpen}
        onClose={handlePreviwModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100001,
        }}
      >
        <Fade in={previwModalOpen}>
          <Box sx={previewModalStyle}>
            {/* <Button onClick={handlePreviwModalClose}>close modal</Button> */}

            <div className="flex">
              <img src={prevImg} className="w-auto max-h-[80vh]" alt="" />
              <div className="-ml-[25px] mt-[5px]">
                <Tooltip title="Close" arrow style={{ zIndex: 10000001 }}>
                  <i
                    role="button"
                    tabIndex={0}
                    className="fas fa-minus p-[2px] py-[0px] text-[16px] rounded-sm bg-opacity-70 bg-gray-100 text-blue-900  cursor-pointer hover:scale-110 hover:bg-opacity-90 hover:text-gray-100 hover:bg-blue-900 transform-all duration-150 ease-in-out"
                    onClick={handlePreviwModalClose}
                  />
                </Tooltip>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default AttachmentLoader;
