import { LoopsClient } from "loops"

export default async function handler(req, res) {
  try {
    const { email, subscribeFields } = req.body

    const loops = await new LoopsClient(process.env.LOOPS_API_KEY);

    const foundContacts = await loops.findContact(email)

    if (foundContacts.length == 0) { // if the contact isn't already in the DB
      await loops.createContact(email, {
        source: `API Email Subscribe - ${subscribeFields.join(",")}`,
        userGroup: "Hack Clubber",
      })
    }

    const fieldsToUpdate = []
    subscribeFields.forEach(field => {
      fieldsToUpdate[field] = Date.now()
    })
    await loops.updateContact(email, fieldsToUpdate)

    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}