const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/tools', (req, res) => res.sendFile(path.join(__dirname, 'public/tools/index.html')));
app.get('/tools/:tool', (req, res) => res.sendFile(path.join(__dirname, 'public/tools', req.params.tool + '.html')));

const PORT = 3000;

app.post('/api/optimize-tags', (req, res) => {
  const { category, tags } = req.body;
  let analysis = [];
  let suggestions = [];
  let tips = [];

  if (tags.length > 13) {
    analysis.push(`You have ${tags.length} tags, but Etsy only allows 13. Remove ${tags.length - 13} tags.`);
  } else if (tags.length < 13) {
    analysis.push(`You have ${tags.length} tags. Etsy allows 13, so add ${13 - tags.length} more.`);
  }

  tags.forEach((tag, index) => {
    if (tag.length > 20) {
      analysis.push(`Tag "${tag}" is ${tag.length} characters. Etsy limits tags to 20 characters. Shorten it.`);
    }
    if (tag.length < 5) {
      analysis.push(`Tag "${tag}" is too short (${tag.length} characters). Try to make tags 5-20 characters for better SEO.`);
    }
    if (tag === 'handmade' || tag === 'vintage' || tag === 'gift') {
      analysis.push(`Tag "${tag}" is too generic. Make it more specific, like "handmade necklace".`);
    }
  });

  if (category === 'jewelry') {
    suggestions.push('handmade necklace', 'sterling silver', 'gift for her');
  } else if (category === 'home-decor') {
    suggestions.push('boho decor', 'wall art', 'cozy home');
  } else if (category === 'clothing') {
    suggestions.push('vintage dress', 'casual wear', 'boho style');
  } else if (category === 'art') {
    suggestions.push('abstract art', 'wall print', 'original painting');
  } else if (category === 'accessories') {
    suggestions.push('leather wallet', 'minimalist bag', 'gift for him');
  }

  tips.push('Use all 13 tags to maximize discoverability.');
  tips.push('Make tags specific to your product, like "handmade silver necklace" instead of "necklace".');
  tips.push('Include keywords buyers might search for, like "gift for her" or "boho decor".');

  res.json({ analysis, suggestions, tips });
});

app.listen(PORT, () => console.log('Server is running on port 3000'));