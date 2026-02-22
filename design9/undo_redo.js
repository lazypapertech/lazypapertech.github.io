// Sistema de Undo/Redo con historial cuantizado
class UndoRedoManager {
  constructor(maxStates = 55) {
    this.history = [];           // Array de estados guardados
    this.currentIndex = -1;      // Índice del estado actual
    this.maxStates = maxStates;  // Máximo de estados a mantener
  }

  // Guardar un nuevo estado (crea deep copy)
  saveState(rectangulos) {
    // Crear una copia profunda del estado actual
    const stateCopy = this.deepCopy(rectangulos);
    
    // Si no estamos al final del historial, eliminar estados "futuros"
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    // Agregar el nuevo estado
    this.history.push(stateCopy);
    
    // Si excedemos el máximo, eliminar el estado más antiguo
    if (this.history.length > this.maxStates) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
    
    // Asegurar que currentIndex apunta al último estado
    this.currentIndex = this.history.length - 1;
  }

  // Deshacer: volver al estado anterior
  undo_action() {
    if (!this.canUndo()) {
      console.warn('No hay estados anteriores para deshacer');
      return null;
    }
    
    this.currentIndex--;
    return this.deepCopy(this.history[this.currentIndex]);
  }

  // Rehacer: avanzar al siguiente estado
  redo_action() {
    if (!this.canRedo()) {
      console.warn('No hay estados posteriores para rehacer');
      return null;
    }
    
    this.currentIndex++;
    return this.deepCopy(this.history[this.currentIndex]);
  }

  // Verificar si se puede deshacer
  canUndo() {
    return this.currentIndex > 0;
  }

  // Verificar si se puede rehacer
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  // Obtener el estado actual sin modificar el índice
  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.deepCopy(this.history[this.currentIndex]);
    }
    return null;
  }

  // Crear una copia profunda (deep copy) del objeto
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Limpiar todo el historial
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }

  // Obtener información del historial (útil para debugging)
  getInfo() {
    return {
      totalStates: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
}

// Uso del sistema:
// ================

// Crear el manager
const undoRedoManager = new UndoRedoManager(55);

// Guardar el estado inicial
undoRedoManager.saveState(unica_regla.rectangulos);

// Cuando hagas cambios en unica_regla.rectangulos, guardar el nuevo estado
function hacerCambiosComplejos() {
  // ... tus modificaciones (agregar, eliminar, modificar rectángulos)
  
  // Guardar el estado después de TODOS los cambios
  undoRedoManager.saveState(unica_regla.rectangulos);
}

// Para deshacer
function undo() {
  const estadoAnterior = undoRedoManager.undo_action();
  if (estadoAnterior !== null) {
    unica_regla.rectangulos = estadoAnterior;
    // Aquí puedes actualizar la UI si es necesario
    console.log('Undo realizado');
  }
}

// Para rehacer
function redo() {
  const estadoSiguiente = undoRedoManager.redo_action();
  if (estadoSiguiente !== null) {
    unica_regla.rectangulos = estadoSiguiente;
    // Aquí puedes actualizar la UI si es necesario
    console.log('Redo realizado');
  }
}

// Ejemplo de uso con atajos de teclado
document.addEventListener('keydown', (e) => {
  // Ctrl+Z para undo
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    undo();
  }
  
  // Ctrl+Shift+Z o Ctrl+Y para redo
  if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || 
      (e.ctrlKey && e.key === 'y')) {
    e.preventDefault();
    redo();
  }
});