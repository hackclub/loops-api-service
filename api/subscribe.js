import { LoopsClient } from "loops"

export default async function handler(req, res) {
  try {
    const { email, subscribeField } = req.body

    const loops = await new LoopsClient(process.env.LOOPS_API_KEY);

    const foundContacts = await loops.findContact(email)

    if (foundContacts.length == 0) { // if the contact isn't already in the DB
      await loops.createContact(email, {
        source: `API Email Subscribe - ${subscribeField}`,
        userGroup: "Hack Clubber",
      })
    }

    await loops.updateContact(email, {
      subscribeField: Date.now()
    })

    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}