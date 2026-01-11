export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  // Extrair cabeçalhos
  const headers = Object.keys(data[0])
  
  // Criar linhas CSV
  const csvRows = [
    headers.join(','), // Cabeçalho
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Tratar valores com vírgulas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value
      }).join(',')
    )
  ]

  const csvContent = csvRows.join('\n')
  
  // Criar blob e link de download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename || 'export'}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToJSON = (data, filename) => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename || 'export'}_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToPDF = async (elementId, filename) => {
  try {
    // Esta função requer uma biblioteca como jsPDF e html2canvas
    console.warn('PDF export requires additional libraries (jsPDF, html2canvas)')
    
    // Código de exemplo se as bibliotecas estiverem instaladas:
    /*
    import jsPDF from 'jspdf'
    import html2canvas from 'html2canvas'
    
    const element = document.getElementById(elementId)
    if (!element) return
    
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    const imgWidth = 210 // A4 width in mm
    const imgHeight = canvas.height * imgWidth / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${filename || 'export'}_${new Date().toISOString().split('T')[0]}.pdf`)
    */
    
    alert('PDF export functionality requires additional setup. Please install jsPDF and html2canvas.')
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    alert('Error exporting to PDF: ' + error.message)
  }
}

export const formatForExport = (data, fields) => {
  if (!data || data.length === 0) return []
  
  return data.map(item => {
    const formattedItem = {}
    
    if (fields) {
      // Filtrar campos específicos
      fields.forEach(field => {
        if (item[field] !== undefined) {
          formattedItem[field] = item[field]
        }
      })
    } else {
      // Usar todos os campos
      Object.keys(item).forEach(key => {
        formattedItem[key] = item[key]
      })
    }
    
    return formattedItem
  })
}