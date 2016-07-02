  $(function(){
    
    function taskHtml(task) {
      var checkedStatus = task.done? "checked" : "";
      var liClass = task.done? "completed" : "";
      var liElement = "<li id=listItem-"+task.id+" class="+liClass+"><div class='view'><input class='toggle' type='checkbox' "+ checkedStatus + " data-id=" + task.id + "><label>" + task.title + "</label></div></li>";      
      return liElement;
    }

    function toggleTask(e) {
      var itemID = $(e.target).data("id");

      var doneValue = Boolean($(e.target).is(":checked"));

      $.post("/tasks/"+itemID, {
         _method: "PUT",
         task: {
          done: doneValue
        }
      }).success(function(data){
        var liHtml = taskHtml(data);
        var oldLi = $('#listItem-'+data.id);
        oldLi.replaceWith(liHtml);
        $('.toggle').change(toggleTask);
      });      
    }

    $('#new-form').submit(function(event){
      event.preventDefault();
      console.log("intercepted.")
      var textbox = $(".new-todo");
      var payload = {
        task: {
          title: textbox.val()
        }
      };

      $.post("/tasks", payload).success(function(data){
        var htmlString = taskHtml(data);
        var ulTodos = $(".todo-list");
        ulTodos.append(htmlString);
        $('.toggle').click(toggleTask);
        $('.new-todo').val('');
      });
    });    

    $.get("/tasks").success(function(data){
      var htmlString = "";
      $.each(data, function(index,task){        
        htmlString += taskHtml(task);
      });
      var ulTodos = $('.todo-list');
      ulTodos.html(htmlString);

      $('.toggle').change(toggleTask);

    });    
  });