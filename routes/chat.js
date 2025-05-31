import express from 'express';
import { chatLoop } from '../agent.js';

const router = express.Router();
 import { permitToMarkdown } from '../helper/function_markdown_format.js';

// router.post('/', async (req, res) => {
//   try {
//     const userMessage = req.body.message;
//     const reply = await chatLoop(userMessage);
//     res.json({reply});
//     // const markdownData = permitToMarkdown(reply);
//     // res.send(markdownData);
//   } catch (err) { 
//     console.error(err);
//     res.status(500).send("Error processing message");
//   }
// });

router.post('/', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const reply = await chatLoop(userMessage);

    // Case 1: If reply is a full permit object, use permitToMarkdown
    if (
      reply &&
      typeof reply === 'object' &&
      reply.taskName &&
      reply.safetyRequirements &&
      reply.startDateTime &&
      reply.endDateTime
    ) {
      const markdownData = permitToMarkdown(reply);
      return res.send(markdownData);
    }

    // Case 2: If reply has full info in string format, look for structured text pattern
    if (typeof reply === 'string' && /Task Name:|Requester:|Start Date/i.test(reply)) {
      // You can implement a parser like extractMarkdownSections(reply)
      // For now, return as-is
      return res.send(reply);
    }

    // Case 3: Plain natural language (like "The status of PTW303 is Issued.")
    return res.send(typeof reply === 'string' ? reply : JSON.stringify(reply, null, 2));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing message");
  }
});


export default router;
