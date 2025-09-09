import express from "express";
import { Express, Request, Response }  from "express";

const app: Express = express();
const port: number = 3000;

// Permite que o Express entenda JSON
app.use(express.json()); 

// Tipagem Users
type User = {
    id: number,
    nome: string;
    idade: number;
};

const users: User[] = [
    {
        id: 1,
        nome: "Fulano", 
        idade: 20
    },
    {
        id: 2,
        nome: "Sicrano", 
        idade: 30
    },
    {
        id: 3,
        nome: "Beltrano", 
        idade: 40
    }
];

app.get("/users", (req: Request, res: Response) => {
    res.json(users);
});

app.get("/users/:id", (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
    }

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(user);
});

app.post("/users", (req: Request, res: Response) => {
    const { nome, idade } = req.body;

    // Validação manual do corpo da requisição
    if (typeof nome !== 'string' || nome.trim() === "") {
        return res.status(400).json({ message: "O nome é obrigatório e não pode estar vazio." });
    }
    if (typeof idade !== 'number' || !Number.isInteger(idade) || idade <= 0) {
        return res.status(400).json({ message: "A idade é obrigatória e deve ser um número inteiro positivo." });
    }
    
    const existingUser: User | undefined = users.find(u => u.nome.toLowerCase() === nome.toLowerCase());
    if (existingUser) {
        return res.status(409).json({ message: "Já existe um usuário com este nome." });
    }

    let maxId: number = 0;
    for (const user of users) {
        if (user.id > maxId) {
            maxId = user.id;
        }
    }
    //maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0) + 1;
    const userWithId: User = { id: maxId + 1, nome, idade,  };

    users.push(userWithId);
    res.status(201).json(users);
});

app.put("/users/:id", (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
    }

    const userIndex: number = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const { nome, idade } = req.body;
    const currentUser: User  = users[userIndex];

    if (nome !== undefined) {
        if (typeof nome !== 'string' || nome.trim() === "") {
            return res.status(400).json({ message: "O nome, se fornecido, não pode estar vazio." });
        }
        currentUser.nome = nome;
    }

    if (idade !== undefined) {
        if (typeof idade !== 'number' || !Number.isInteger(idade) || idade <= 0) {
            return res.status(400).json({ message: "A idade, se fornecida, deve ser um número inteiro positivo." });
        }
        currentUser.idade = idade;
    }
    
    if (nome === undefined && idade === undefined) {
        return res.status(400).json({ message: "Nenhum dado para atualizar foi fornecido (nome ou idade)." });
    }

    users[userIndex] = currentUser;
    res.json(currentUser);
});

app.delete("/users/:id", (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
    }

    const userIndex: number = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`)
});