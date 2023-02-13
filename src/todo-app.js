(function () {

  let todo = [];

  // создаем и возвращаем загловок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    input.addEventListener('input', function () {
      if (input.value.length > 0) {
        button.disabled = false;
      }
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем и возвращаем элемент списка
  function createTodoItem(name) {
    let item = document.createElement('li');
    // кнопки пемощаем в элемент, который покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента спискаб а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    item.id = Math.floor((Math.random() * (1000 - 1 + 1)) + 1);

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
      buttonGroup
    };
  }

  function createTodoApp(container, title = 'Список дел', listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    function changeItemStatus(array, item) {
      array.map((obj) => {
        if (obj.id === item.id & obj.done === false) {
          obj.done = true;
        } else if (obj.id === item.id & obj.done === true) {
          obj.done = false;
        }
      });
    }

    function searchDeleteItem(array, item) {
      return array.filter((obj) =>
        obj.id !== item.id);
    }

    // добавляем обработчики на кнопки
    function changeDoneStatus(item, button) {
      button.addEventListener('click', function () {
        todo = JSON.parse(localStorage.getItem(listName));
        item.classList.toggle('list-group-item-success');
        changeItemStatus(todo, item);
        localStorage.setItem(listName, JSON.stringify(todo));
      })
    };

    function confirmDelete(item, button) {
      button.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          todo = JSON.parse(localStorage.getItem(listName));
          todoNew = searchDeleteItem(todo, item);
          localStorage.setItem(listName, JSON.stringify(todoNew));
          item.remove();
        }
      })
    };

    if (localStorage.getItem(listName)) {
      todo = JSON.parse(localStorage.getItem(listName));

      for (let object of todo) {
        let todoItem = createTodoItem(todoItemForm.input.value);
        todoItem.item.id = object.id;
        todoItem.item.textContent = object.name;
        if (object.done == true) {
          todoItem.item.classList.add('list-group-item-success');
        }
        else {
          todoItem.item.classList.remove('list-group-item-success');
        }

        changeDoneStatus(todoItem.item, todoItem.doneButton);
        confirmDelete(todoItem.item, todoItem.deleteButton);

        todoList.append(todoItem.item);
        todoItem.item.append(todoItem.buttonGroup);
      }
    }

    // браузер создает событие submit на форме по нажатию на enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (evt) {
      // эта строка необходима, чтобы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      evt.preventDefault();
      // и игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value);

      // добавляем обработчики на кнопки
      changeDoneStatus(todoItem.item, todoItem, doneButton);
      confirmDelete(todoItem.item, todoItem.deleteButton);

      let localStorageData = localStorage.getItem(listName); // записываем данные в переменную из locaStorage

      // перезапись пи перезагрузке страницы
      if (localStorageData == null) {
        todo = [];
      } else {
        todo = JSON.parse(localStorageData);
      }

      function createTodoItemObject(array) {
        const itemObject = {
          id: todoItem.item.id,
          name: todoItemForm.input.value,
          done: false
        }

        array.push(itemObject);
      }

      createTodoItemObject(todo);
      localStorage.setItem(listName, JSON.stringify(todo));

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);
      // обнуляем значение в поле, чтобы не стирать его вручную
      todoItemForm.input.value = '';
      // деактивируем кнопку "Добавить дело"
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
