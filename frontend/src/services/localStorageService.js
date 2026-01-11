const APP_DATA_KEYS = ['categories', 'transactions', 'cards', 'goals'];

const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data from localStorage for key: ${key}`, error);
    return null;
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key: ${key}`, error);
  }
};

const exportData = () => {
  try {
    const allData = {};
    for (const key of APP_DATA_KEYS) {
      allData[key] = getData(key) || [];
    }

    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. See console for details.');
  }
};

const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Basic validation
        const hasAllKeys = APP_DATA_KEYS.every(key => importedData.hasOwnProperty(key) && Array.isArray(importedData[key]));
        
        if (!hasAllKeys) {
          reject(new Error('Invalid or corrupted backup file.'));
          return;
        }

        for (const key of APP_DATA_KEYS) {
          saveData(key, importedData[key]);
        }
        
        resolve();
      } catch (error) {
        reject(new Error('Failed to parse backup file. Make sure it is a valid JSON file.'));
      }
    };

    reader.onerror = (error) => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsText(file);
  });
};

const resetData = () => {
  for (const key of APP_DATA_KEYS) {
    localStorage.removeItem(key);
  }
};


export const localStorageService = {
  getData,
  saveData,
  exportData,
  importData,
  resetData,
};
