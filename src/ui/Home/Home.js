import "./Home.css";
import React, { useEffect, useState } from "react";
import { api } from "../../api";

export const Home = () => {
  const [firstCharacterSelect, setFirstCharacterSelect] = useState();
  const [secondCharacterSelect, setSecondCharacterSelect] = useState();
  const [characters, setCharacters] = useState([]);
  const [comics, setComics] = useState([]);
  const clearButton = () => {
    setFirstCharacterSelect();
    setSecondCharacterSelect();
    setComics([]);
  };

  useEffect(() => {
    const fetchAllCharacters = async () => {
      const result = await api.characters();

      setCharacters(result);
    };
    fetchAllCharacters();
  }, []);

  useEffect(() => {
    if (!firstCharacterSelect || !secondCharacterSelect) return;
    const getCommonComics = async () => {
      const firstCharacterComics = await api.comics(firstCharacterSelect);
      const secondCharacterComics = await api.comics(secondCharacterSelect);
      const commonComics = firstCharacterComics.filter((comic1) =>
        secondCharacterComics.some((comic2) => comic1.id === comic2.id)
      );
      setComics(commonComics);
    };
    getCommonComics();
  }, [firstCharacterSelect, secondCharacterSelect]);

  return (
    <main className="container">
      <Header />
      <ComicList
        characters={characters}
        firstCharacterSelect={firstCharacterSelect}
        secondCharacterSelect={secondCharacterSelect}
        comics={comics}
        setFirstCharacterSelect={setFirstCharacterSelect}
        setSecondCharacterSelect={setSecondCharacterSelect}
        clearButton={clearButton}
      />
      <Footer itemsCount={comics.length} />
    </main>
  );
};

const Header = () => {
  return (
    <header>
      <h1 className="title">Buscador de cómics de Marvel</h1>
      <h2 className="subtitle">
        Este buscador encontrará los cómics en los que aparezcan los dos
        personajes que selecciones en el formulario
      </h2>
    </header>
  );
};

const ComicList = ({
  comics,
  characters,
  firstCharacterSelect,
  secondCharacterSelect,
  setFirstCharacterSelect,
  setSecondCharacterSelect,
  clearButton,
}) => {
  const selectOptions = characters.map((characters) => ({
    value: characters.id,
    label: characters.name,
  }));
  //console.log(firstCharacterSelect);
  return (
    <section>
      <p className="inputLabel">Selecciona una pareja de personajes</p>
      <div className="inputContainer">
        <Select
          options={selectOptions}
          setSelectedOptions={setFirstCharacterSelect}
          selectOption={firstCharacterSelect}
        />
        <Select
          options={selectOptions}
          setSelectedOptions={setSecondCharacterSelect}
          selectOption={secondCharacterSelect}
        />
        <button className="clearButton" onClick={clearButton}>
          Limpiar búsqueda
        </button>
      </div>
      {comics.map((comic) => (
        <div key={comic.id} className="comicCard">
          <p className="comicTitle">{comic.title}</p>
          <p>{comic.characters.join(", ")}</p>
        </div>
      ))}
    </section>
  );
};

const Footer = ({ itemsCount }) => {
  return (
    <footer>
      <p>Elementos en la lista: {itemsCount}</p>
    </footer>
  );
};

const Select = ({ options, setSelectedOptions, selectOption = "" }) => {
  return (
    <select
      className="characterSelector"
      onChange={(evento) => setSelectedOptions(evento.target.value)}
      value={selectOption}
    >
      <option value="" />
      {options.map((option) => {
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
};
