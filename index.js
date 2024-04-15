import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"1234",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));





async function getItems(){
  let items = [];
  let data = await db.query("SELECT * FROM items ORDER BY id ASC");
  data.rows.forEach(item=>{
    items.push(item); 
  });
  return items;
}

//getItems();

app.get("/", async (req, res) => {;
  const x = await getItems();
  try {
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: x,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
   const item = req.body.newItem;
   try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  } 
});

app.post("/edit", async (req, res) => {
  const editreqId =req.body.updatedItemId;
  const editreqTitle = req.body.updatedItemTitle
  try {
    await db.query("UPDATE items SET title = $1 WHERE id= $2", [editreqTitle, editreqId]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
const deleteRequestId = req.body.deleteItemId;
try {
  await db.query("DELETE FROM items WHERE id=$1", [deleteRequestId]);
  res.redirect("/");
} catch (error) {
  console.log(error);
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
