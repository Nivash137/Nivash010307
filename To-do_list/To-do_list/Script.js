document.addEventListener('DOMContentLoaded', () => {
    const input= document.getElementById('to-do-text');
    const btn = document.getElementById('add-task-btn');
    const taskscontainer = document.getElementById('tasks');
    const emptyImage = document.querySelector('.empty-img');
    const todoContainer = document.querySelector('.To-do-container');
    const progressBar = document.getElementById('progress');
    const progressNumber = document.getElementById('numbers');




    const imgInvisible = () => {

        todoContainer.style.width = taskscontainer.children.length > 0 ? '100%' : '50%';   
        if(taskscontainer.children.length === 0) {
            emptyImage.style.display = 'block';
        } else {
            emptyImage.style.display = 'none';
        }

    };

    const updateProgress =(checkCompletion = true) => {
        const totalTask =taskscontainer.children.length;
        const completedTasks = taskscontainer.querySelectorAll('.checkbox:checked').length;
        progressBar.style.width = totalTask ? `${(completedTasks/totalTask) *100}%` : '0%';
        progressNumber.textContent = totalTask ? `${completedTasks}/${totalTask}` : `0/0`;

        if (completedTasks && totalTask > 0 && completedTasks === totalTask) {
            fireConfetti();
        };

    };

    // save content in browser storage 
    const saveTasksToLocalStorage = () => {
        const Alltasks = Array.from(taskscontainer.querySelectorAll('li')).map(li => ( {
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(Alltasks)); 

    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
        imgInvisible();
        updateProgress();
    }

    const addTask = (text, completed = false,checkCompletion = true) => {
        // event.preventDefault();
        const tasks = text || input.value.trim();
        if (tasks === '') {
            alert('Please enter a task.');
            return;
        }

        const li =document.createElement("li");
        li.innerHTML =`
        <input type = "checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
        <span>${tasks}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        
        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');


        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }


        checkbox.addEventListener('change', () => {

            if (checkbox.checked) {
                li.classList.add('completed');
                editBtn.disabled = true;
                editBtn.style.opacity = '0.5';
                editBtn.style.pointerEvents = 'none';   
            
            }

            else {
                li.classList.remove('completed');
                editBtn.disabled = false;
                editBtn.style.opacity = '1';
                editBtn.style.pointerEvents = 'auto';   
            }
            updateProgress();
            saveTasksToLocalStorage();
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
         taskscontainer.removeChild(li);
         imgInvisible();
         updateProgress();
         saveTasksToLocalStorage();
        });


        editBtn.addEventListener('click', () => {
            if(!checkbox.checked) {
                input.value= li.querySelector('span').textContent;
                taskscontainer.removeChild(li);
                imgInvisible();
                updateProgress(false);
                saveTasksToLocalStorage();
            }
        
        });




        taskscontainer.appendChild(li);
        input.value = '';
        imgInvisible();
        updateProgress(checkCompletion);
        saveTasksToLocalStorage();


    };

   

    btn.addEventListener('click', () => addTask());
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter'){
            event.preventDefault();
            addTask();
        }
    });

    loadTasksFromLocalStorage();

});

const fireConfetti = () => {
    const duration = 15 * 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const interval = setInterval(function() {
  const timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    return clearInterval(interval);
  }

  const particleCount = 50 * (timeLeft / duration);

  // since particles fall down, start a bit higher than random
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
  );
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  );
}, 250);

};