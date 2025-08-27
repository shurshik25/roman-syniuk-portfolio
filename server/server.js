const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Database setup
const db = new sqlite3.Database('./portfolio.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Content table
    db.run(`CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      field TEXT NOT NULL,
      value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(section, field)
    )`);

    // Array items table
    db.run(`CREATE TABLE IF NOT EXISTS array_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      field TEXT NOT NULL,
      item_index INTEGER NOT NULL,
      item_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(section, field, item_index)
    )`);

    // Insert initial data if empty
    db.get("SELECT COUNT(*) as count FROM content", (err, row) => {
      if (err) {
        console.error('Error checking content count:', err);
        return;
      }
      
      if (row.count === 0) {
        insertInitialData();
      }
    });
  });
}

// Insert initial portfolio data
function insertInitialData() {
  const initialData = [
    // Hero section
    { section: 'hero', field: 'name', value: 'Роман Синюк' },
    { section: 'hero', field: 'title', value: 'Актор театру та кіно' },
    { section: 'hero', field: 'description', value: 'Професійний актор з досвідом у театрі та кіно' },
    { section: 'hero', field: 'stats', value: JSON.stringify([
      { label: 'Років досвіду', value: '5+' },
      { label: 'Постав', value: '20+' },
      { label: 'Ролей', value: '30+' }
    ]) },
    
    // About section
    { section: 'about', field: 'biography', value: 'Роман Синюк - талановитий актор з багатим досвідом у театральному та кінематографічному мистецтві.' },
    { section: 'about', field: 'skills', value: JSON.stringify(['Акторська майстерність', 'Сценічна мова', 'Пластика', 'Вокал']) },
    { section: 'about', field: 'achievements', value: JSON.stringify(['Лауреат театральних фестивалів', 'Нагороди за найкращі ролі']) },
    
    // Contact section
    { section: 'contact', field: 'email', value: 'roman.syniuk@example.com' },
    { section: 'contact', field: 'phone', value: '+380501234567' },
    { section: 'contact', field: 'social', value: JSON.stringify({
      facebook: 'https://facebook.com/roman.syniuk',
      instagram: 'https://instagram.com/roman.syniuk',
      youtube: 'https://youtube.com/@roman.syniuk'
    }) },
    { section: 'contact', field: 'services', value: JSON.stringify(['Театральні постановки', 'Кінофільми', 'Телесеріали', 'Рекламні ролики']) }
  ];

  const stmt = db.prepare('INSERT OR REPLACE INTO content (section, field, value) VALUES (?, ?, ?)');
  
  initialData.forEach(item => {
    stmt.run(item.section, item.field, item.item_data || item.value);
  });
  
  stmt.finalize();
  console.log('Initial data inserted');
}

// API Routes

// Get all content
app.get('/api/content', (req, res) => {
  db.all("SELECT section, field, value FROM content", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Group by section
    const content = {};
    rows.forEach(row => {
      if (!content[row.section]) {
        content[row.section] = {};
      }
      
      try {
        // Try to parse JSON values
        content[row.section][row.field] = JSON.parse(row.value);
      } catch {
        // If not JSON, use as string
        content[row.section][row.field] = row.value;
      }
    });
    
    res.json(content);
  });
});

// Get content by section
app.get('/api/content/:section', (req, res) => {
  const { section } = req.params;
  
  db.all("SELECT field, value FROM content WHERE section = ?", [section], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const sectionContent = {};
    rows.forEach(row => {
      try {
        sectionContent[row.field] = JSON.parse(row.value);
      } catch {
        sectionContent[row.field] = row.value;
      }
    });
    
    res.json(sectionContent);
  });
});

// Update content field
app.put('/api/content/:section/:field', (req, res) => {
  const { section, field } = req.params;
  const { value } = req.body;
  
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
  
  db.run(
    "INSERT OR REPLACE INTO content (section, field, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
    [section, field, stringValue],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({ 
        success: true, 
        message: 'Content updated successfully',
        id: this.lastID 
      });
    }
  );
});

// Update nested content
app.put('/api/content/:section/:field/:subField', (req, res) => {
  const { section, field, subField } = req.params;
  const { value } = req.body;
  
  // Get current field value
  db.get("SELECT value FROM content WHERE section = ? AND field = ?", [section, field], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    let currentValue = {};
    if (row && row.value) {
      try {
        currentValue = JSON.parse(row.value);
      } catch {
        currentValue = {};
      }
    }
    
    // Update nested field
    currentValue[subField] = value;
    const stringValue = JSON.stringify(currentValue);
    
    db.run(
      "INSERT OR REPLACE INTO content (section, field, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      [section, field, stringValue],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({ 
          success: true, 
          message: 'Nested content updated successfully',
          id: this.lastID 
        });
      }
    );
  });
});

// Update array item
app.put('/api/content/:section/:field/:index', (req, res) => {
  const { section, field, index } = req.params;
  const { value } = req.body;
  
  // Get current array
  db.get("SELECT value FROM content WHERE section = ? AND field = ?", [section, field], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    let currentArray = [];
    if (row && row.value) {
      try {
        currentArray = JSON.parse(row.value);
      } catch {
        currentArray = [];
      }
    }
    
    // Update array item
    const numIndex = parseInt(index);
    if (numIndex >= 0 && numIndex < currentArray.length) {
      currentArray[numIndex] = { ...currentArray[numIndex], ...value };
    }
    
    const stringValue = JSON.stringify(currentArray);
    
    db.run(
      "INSERT OR REPLACE INTO content (section, field, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      [section, field, stringValue],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({ 
          success: true, 
          message: 'Array item updated successfully',
          id: this.lastID 
        });
      }
    );
  });
});

// Add array item
app.post('/api/content/:section/:field', (req, res) => {
  const { section, field } = req.params;
  const { item } = req.body;
  
  // Get current array
  db.get("SELECT value FROM content WHERE section = ? AND field = ?", [section, field], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    let currentArray = [];
    if (row && row.value) {
      try {
        currentArray = JSON.parse(row.value);
      } catch {
        currentArray = [];
      }
    }
    
    // Add new item
    currentArray.push(item);
    const stringValue = JSON.stringify(currentArray);
    
    db.run(
      "INSERT OR REPLACE INTO content (section, field, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      [section, field, stringValue],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({ 
          success: true, 
          message: 'Array item added successfully',
          id: this.lastID,
          newIndex: currentArray.length - 1
        });
      }
    );
  });
});

// Remove array item
app.delete('/api/content/:section/:field/:index', (req, res) => {
  const { section, field, index } = req.params;
  
  // Get current array
  db.get("SELECT value FROM content WHERE section = ? AND field = ?", [section, field], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    let currentArray = [];
    if (row && row.value) {
      try {
        currentArray = JSON.parse(row.value);
      } catch {
        currentArray = [];
      }
    }
    
    // Remove item
    const numIndex = parseInt(index);
    if (numIndex >= 0 && numIndex < currentArray.length) {
      currentArray.splice(numIndex, 1);
    }
    
    const stringValue = JSON.stringify(currentArray);
    
    db.run(
      "INSERT OR REPLACE INTO content (section, field, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      [section, field, stringValue],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({ 
          success: true, 
          message: 'Array item removed successfully',
          id: this.lastID
        });
      }
    );
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
