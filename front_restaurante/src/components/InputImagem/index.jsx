/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDropzone } from 'react-dropzone';
import './styles.css';
import Placeholder from '../../assets/produto.png';

export default function InputImagem({ value, setValue }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file),
      }));
      setValue(acceptedFiles[0].preview);
    },
  });

  return (
    <div
      className="placeholder-base"
      style={{ backgroundImage: `url(${value || Placeholder})`, boxShadow: 'inset 0rem -13rem 10rem rgba(0,0,0,0.7)' }}
      {...getRootProps()}
    >
      <input
        style={{ backgroundImage: `url(${value || Placeholder})` }}
        {...getInputProps()}
      />
      {
        isDragActive
          ? <div className="placeholder-texto"><p>Arquivo aqui</p></div>
          : (
            <div className="placeholder-texto">
              <p>
                Clique ou arraste
                <br />
                para adicionar uma imagem
              </p>
            </div>
          )
      }
    </div>
  );
}
