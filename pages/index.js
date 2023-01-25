import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [backstory, setBackstory] = useState();
  const [description, setDescription] = useState();
  const [organization, setOrganization] = useState();
  const [relationships, setRelationships] = useState();

  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [raceInput, setRaceInput] = useState("");
  const [classInput, setClassInput] = useState("");
  const [alignmentInput, setAlignmentInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          char_name: nameInput, 
          char_age: ageInput,
          char_gender: genderInput,
          char_race: raceInput,
          char_class: classInput,
          char_alignment: alignmentInput,
          char_description: descriptionInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setBackstory(data.backstory);
      setDescription(data.description);
      setOrganization(data.organization);
      setRelationships(data.relationships);

      setNameInput("");
      setAgeInput("");
      setGenderInput("");
      setRaceInput("");
      setClassInput("");
      setAlignmentInput("");
      setDescriptionInput("");

    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Roleplayer's Character Backstory Generator</title>
      </Head>

      <main className={styles.main}>
        <h3>Basic Information</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter the name of your character"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <input
            type="text"
            name="age"
            placeholder="Enter the age of your character, in years or a description (e.g. 'young adult')"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
          />
          <input
            type="text"
            name="gender"
            placeholder="Enter the gender of your character"
            value={genderInput}
            onChange={(e) => setGenderInput(e.target.value)}
          />
          <input
            type="text"
            name="race"
            placeholder="Enter the race of your character"
            value={raceInput}
            onChange={(e) => setRaceInput(e.target.value)}
          />
          <input
            type="text"
            name="class"
            placeholder="Enter the class(es) of your character, separated by commas"
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
          />
          <input
            type="text"
            name="alignment"
            placeholder="Enter the alignment of your character"
            value={alignmentInput}
            onChange={(e) => setAlignmentInput(e.target.value)}
          />
          <input
            type="text"
            name="description"
            placeholder="(optional) Write a short sentence describing your character"
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />
          <input type="submit" value="Generate story" />
        </form>
        <div className={styles.result}>
          <h4>Backstory</h4>
          <p>{backstory}</p>
        </div>
      </main>
    </div>
  );
}
