const FIRST_NAMES = [
  "Ada", "Grace", "Alan", "Margaret", "Linus", "Barbara", "Donald", "Katherine",
  "John", "Radia", "Dennis", "Frances", "Ken", "Sophie", "Guido", "Elena",
  "Brian", "Hedy", "Claude", "Marie",
];
const LAST_NAMES = [
  "Lovelace", "Hopper", "Turing", "Hamilton", "Torvalds", "Liskov", "Knuth",
  "Johnson", "Carmack", "Perlman", "Ritchie", "Allen", "Thompson", "Wilson",
  "van Rossum", "Ferrante", "Kernighan", "Lamarr", "Shannon", "Curie",
];
const DOMAINS = ["example.com", "mail.test", "toolbox.dev", "sample.org"];
const STREETS = ["Maple St", "Oak Ave", "Bridge Rd", "Sunset Blvd", "Market St", "Elm Ct"];
const CITIES = ["Springfield", "Riverside", "Franklin", "Greenville", "Clinton", "Fairview"];
const STATES = ["CA", "TX", "NY", "WA", "CO", "OR"];
const COMPANIES = ["Acme Corp", "Globex", "Initech", "Umbrella", "Soylent", "Hooli"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface FakePerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  company: string;
}

export function generateFakePerson(): FakePerson {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, "")}@${pick(DOMAINS)}`,
    phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
    street: `${randomInt(1, 9999)} ${pick(STREETS)}`,
    city: pick(CITIES),
    state: pick(STATES),
    zip: String(randomInt(10000, 99999)),
    company: pick(COMPANIES),
  };
}
