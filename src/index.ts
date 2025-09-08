import express, { Request, Response } from "express";

const app = express();
const port = 3000;

//Tipagem usuarios
interface User { 
    name: string;
    idade: number;
}

const users: User[] = [
    {name: "Fulano", idade: 30},
    {name: "Sicrano", idade: 60}
];

//Rota para receber JSON
app.use(express.json()); 

//Rota de Inicio
app.get("/", (_req: Request, res: Response) => {
    res.send("Bem-vindo a minha API");
});

//Lista de todos os usuarios
app.get("/users", (_req: Request, res: Response) => {
    res.json(users);
});

//Busca usuario pelo nome
app.get("/users/:name", (req: Request, res: Response) => {
    const { name } = req.params;
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
});

//Cria um novo usuario
app.post ("/users", (req: Request, res: Response) => {
    const newUser: User = req.body;
    users.push(newUser);
    res.status(201).json(users);
});

//Att um usuario especifico
app.put("/users/:name", (req: Request, res: Response) => {
    const { name } = req.params;
    const index = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase());

    if (index === -1) {
        return res.status(404).json({ error: "Usuário não encontrado"});
    }

    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
});

 //Deleta um usuario especifico
app.delete("/users/:name", (req, res) => {
    const { name } = req.params;
    const index = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase());

    if(index === -1) {
        return res.status(404).json({ error: "Usuário não encontrado"});
    }

    const deletedUser = users.splice(index, 1);
    res.json({ message: "Usuário deletado com sucesso", user: deletedUser[0] });
});

//Inicia o servidor
app.listen(port, () => {
    console.log(`A API subiu na porta ${port} !`)
});