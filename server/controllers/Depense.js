import Depense from '../models/Depense.js';



export const createDepense = async (req, res) => {
  try {
      let newDepense;
              const { titre , description, nbUnit , prixUnit } = req.body;
              newDepense = new Depense({
                  titre : titre,
                  description : description ,
                  nbUnit:nbUnit,
                  prixUnit : prixUnit
              });

      const savedDepense = await newDepense.save();
      res.status(201).json({ savedDepense , msg :"created succesfully"});


  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}


export const getAllDepenses = async (req, res) => {
  try { //console.log("Hear1");
    const depenses = await Depense.find();
    //console.log("Hear2");
    res.status(200).json(depenses);


  } catch (err) {
      res.status(500).json({error: err.message  });
  }
}

export const DeleteDepense = async (req, res) => {
  try { 
    const deletedepense = await Depense.findByIdAndDelete( req.params.id);
  
    res.status(200).json({deletedepense , msg : "deleted successfully" });


  } catch (err) {
      res.status(500).json({ error: err.message  });
  }
}