import Tache from '../models/Tache.js';



export const createTache = async (req, res) => {
  try {
      let newTache;
              const { nom ,description } = req.body;
              newTache = new Tache({
                  nom:nom,
                  description : description   
              });

      const savedTache = await newTache.save();
      res.status(201).json({ savedTache , msg:"created successfully" });


  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}


export const getAllTaches = async (req, res) => {
  try { //console.log("Hear1");
    const taches = await Tache.find();
    //console.log("Hear2");
    res.status(200).json(taches);


  } catch (err) {
      res.status(500).json({ error: err.message  });
  }
}

export const DeleteTache = async (req, res) => {
  try { 
    const deletetache = await Tache.findByIdAndDelete( req.params.id);
  
    res.status(200).json({deletetache , msg : "deleted successfully" });


  } catch (err) {
      res.status(500).json({ error: err.message  });
  }
}