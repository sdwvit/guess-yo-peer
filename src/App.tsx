import React, {useEffect, useState} from 'react';
import './App.css';
import PEOPLE from './peer-data.json';

interface Person {
    departmentName: string;
    hireDate: string;
    directReportsCount: number;
    jobTitle: string;
    divisionName: string;
    photo: string;
    reportsTo: string;
    name: string;
    location: string;
    id: string;
    email: string;
    levels: number
}

const THEMES: Array<keyof Person> = [
    'departmentName',
    //'hireDate',
    'jobTitle',
    'name',
    'location',
];

function getRandomIndex(max: number) {
    return Math.floor(Math.random() * max); // 0..max-1
}

function getRandomElement<T>(pool: T[]) {
    return pool[getRandomIndex(pool.length)] as T;
}

function App() {
    const [person, setPerson] = useState<Person>(getRandomElement(PEOPLE) as Person);
    const [guessed, setGuessed] = useState<Person | null>(null);
    const [tried, setTried] = useState<Record<string, any>>({});
    const [win, setWin] = useState<boolean>(false);
    const [candidates, setCandidates] = useState<Array<Person | null>>([]);
    const [theme, setTheme] = useState<keyof Person>(getRandomElement(THEMES));

    useEffect(() => {
        const candidatesMap: Record<string | number, Person> = {};
        let candidate;
        for (let i = 0; i < 4; i++) {
            do {
                candidate = getRandomElement(PEOPLE) as Person;
            } while (candidatesMap[candidate[theme]] || candidate.id === person.id);
            candidatesMap[candidate[theme]] = candidate;
        }

        setPerson(getRandomElement(Object.values(candidatesMap)));
        setCandidates(Object.values(candidatesMap).sort(() => Math.random() - 0.5));
        setTheme(getRandomElement(THEMES));
        setWin(false);
        setTried({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guessed]);

    if (!person) {
        return null;
    }

    const validate = (selection: Person) => {
        if (selection[theme] === person[theme]) {
            setWin(true);
        } else {
            setTried({ ...tried, [selection.id]: true });
        }
    }

    return (
        <div className="App">
            <h1 className="card">
                A Guessing game or I had nothing to do after coming home from bar!
            </h1>
            {
                win
                ? <div className="card">
                    <h2>Congrats! You guessed {person.name}!</h2>
                    <img src={person.photo} alt={person.name} />
                    <p>Name: {person.name}</p>
                    <p>Email: {person.email}</p>
                    <p>Department Name: {person.departmentName}</p>
                    <p>Hire Date: {person.hireDate}</p>
                    <p>Job Title: {person.jobTitle}</p>
                    <p>Location: {person.location}</p>
                    <button onClick={() => setGuessed(person)}>Continue</button>
                  </div>
                : <div className="card">
                    <h2>Which of these people has a {theme} of {person[theme]}?</h2>
                    <br />
                    {(candidates as any[]).map<JSX.Element>((candidate: Person, i: number) =>
                        candidate && (<button key={candidate.id} onClick={() => validate(candidate)} className="card">
                            <img src={candidate.photo} alt={`candidate ${i}`} />
                            {tried[candidate.id] && (
                                <>
                                    <p>Awkward! {candidate.name}'s {theme} is not {person[theme]}</p>
                                    <p>Here is some more info about {candidate.name}:</p>
                                    <p>Name: {candidate.name}</p>
                                    <p>Email: {candidate.email}</p>
                                    <p>Department Name: {candidate.departmentName}</p>
                                    <p>Hire Date: {candidate.hireDate}</p>
                                    <p>Job Title: {candidate.jobTitle}</p>
                                    <p>Location: {candidate.location}</p>
                                </>
                            )}
                        </button>)
                    )}
                </div>
            }
        </div>
    );
}

export default App;
