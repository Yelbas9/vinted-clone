import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Publish = ({ userToken }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => setPictures(acceptedFiles),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("condition", condition);
      formData.append("city", city);
      formData.append("brand", brand);
      formData.append("size", size);
      formData.append("color", color);
      for (let i = 0; i < pictures.length; i++) {
        formData.append("picture", pictures[i]);
      }

      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/offer/publish",
        formData,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        navigate(`/offer/${response.data._id}`);
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="publish-page">
      <h2>Vends ton article</h2>
      <form onSubmit={handleSubmit} className="publish-form">
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {pictures.length > 0 ? (
            <div className="preview-images">
              {pictures.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="preview-image"
                />
              ))}
            </div>
          ) : (
            <div className="add-photo">
              <span>+ Ajoute une photo</span>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Décris ton article"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Marque"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Taille"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <input
          type="text"
          placeholder="Couleur"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="État"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lieu"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <div className="price-row">
          <input
            type="number"
            placeholder="Prix (€)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <label>
            <input type="checkbox" />
            Je suis intéressé(e) par les échanges
          </label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default Publish;
