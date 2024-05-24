import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const ImageCropper = ({ imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
     <div className="modal-crop-overlay">
          <div className="modal-crop">
            <div className="modal-crop-content">
                <span className="close">&times;</span>
                <h2>Crop Image</h2>
                <div className="crop-container">
                    <div className="cropper-wrapper">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={onCropChange}
                            onZoomChange={setZoom}
                            onCropComplete={onCropCompleteHandler}
                        />
                    </div>
                </div>
                <button onClick={onCropConfirm}>Confirm Crop</button>
            </div>
        </div>
    </div>
  );
};

export default ImageCropper;
