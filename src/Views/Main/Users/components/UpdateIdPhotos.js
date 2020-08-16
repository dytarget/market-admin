import React from "react";
import { Button, Modal } from "antd";
import config from "../../../../config/config";
import { useState } from "react";

export const UpdateIdPhotos = ({
  identificationPhotos,
  deleteImage,
  _pickIdImage,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>
        Редактировать Фотографии Документа
      </Button>
      <Modal
        width={600}
        title="Редактировать Фотографии Документа"
        visible={visible}
        cancelButtonProps={{
          style: { opacity: 0 },
          disabled: true,
        }}
        okText="Закрыть"
        closable={false}
        onOk={() => setVisible(false)}
      >
        <div>
          {identificationPhotos?.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <img
                  src={`${config.url}images/${identificationPhotos[0].imageName}`}
                  style={{ width: 120, marginRight: 10 }}
                />
                <span style={{ marginRight: 10 }}>
                  {identificationPhotos[0].imageName}
                </span>
              </div>

              <Button
                type="danger"
                onClick={() => deleteImage(identificationPhotos[0].id)}
              >
                удалить
              </Button>
            </div>
          ) : (
            <div>
              <input onChange={_pickIdImage} accept="image/*" type="file" />
              Выбрать Фотографию Документа
            </div>
          )}
          {identificationPhotos?.length > 1 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <img
                  src={`${config.url}images/${identificationPhotos[1].imageName}`}
                  style={{ width: 120 }}
                />
                <span>{identificationPhotos[1].imageName}</span>
              </div>

              <Button onClick={() => deleteImage(identificationPhotos[1].id)}>
                Удалить
              </Button>
            </div>
          ) : (
            <div>
              <div>
                <input onChange={_pickIdImage} accept="image/*" type="file" />
                Выбрать Фотографию Документа
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
