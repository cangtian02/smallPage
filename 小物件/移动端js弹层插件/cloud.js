/*
	var obj = {
		name: '狼族小狈',
		QQ: 1340641314,
		github: 'https://github.com/1340641314/cloud',
		statement: '在保留头部版权的情况下，可以自由发布修改，应用于商业用途',
		version: '1.0.0',
		update: '2016-1-5'
	};
*/
(function (win) {

  var doc = document;
  win.cloud = {
    setting: null,
    style: null,
    element: {},
    timer: null,
    init: function () {
      var element = this.element;
      var setting = this.setting;
      var style = this.style;

      //主框架
      element.oCloud = doc.createElement('div');
      element.oCloud.className = 'cloud';

      //主内容区
      element.oMain = doc.createElement('div');
      element.oMain.className = 'cloud-main';
      element.oCloud.appendChild(element.oMain);

      //罩层
      if (setting.covered != false) {
        element.oCovered = doc.createElement('div');
        element.oCovered.className = 'cloud-covered';
        if (setting.coveredClose != false) {
          element.oCovered.addEventListener('click', function (oCloud) {
            this.close(oCloud);
          }.bind(this, element.oCloud), false);
        }
        element.oCloud.appendChild(element.oCovered);
        doc.body.style.overflow = 'hidden';
      }

      //标题
      if (setting.title) {
        element.oTitle = doc.createElement('div');
        element.oTitle.className = 'cloud-title';
        element.oTitle.innerHTML = setting.title;
        element.oMain.appendChild(element.oTitle);

        //关闭
        if (setting.close) {
          element.oClose = doc.createElement('div');
          element.oClose.className = 'cloud-title-close';
          element.oClose.addEventListener('click', function (oCloud) {
            this.close(oCloud);
          }.bind(this, element.oCloud), false);
          element.oTitle.appendChild(element.oClose);
        }
      }

      //内容
      element.oContent = doc.createElement('div');
      element.oContent.className = 'cloud-content';
      element.oContent.innerHTML = setting.content || '暂无内容';
      element.oMain.appendChild(element.oContent);

      //按钮
      if (setting.button && typeof (setting.button) === 'object' && typeof (setting.button.length) == 'number') {
        element.oButton = doc.createElement('div');
        element.oButton.className = 'cloud-button';

        //循环子列表按钮
        var aButton = setting.button;
        for (var i = 0; i < aButton.length; i++) {
          var oBtn = doc.createElement('div');
          oBtn.className = 'cloud-button-item';
          oBtn.innerHTML = aButton[i].name;
          //按钮绑定事件
          if (!aButton[i].callback) {
            aButton[i].callback = function () {}; //如果没有回调函数，则给一个空函数
          }
          oBtn.addEventListener('click', function (oCloud, callback) {
            this.close(oCloud);
            callback(); //执行按钮回调函数
          }.bind(this, element.oCloud, aButton[i].callback.bind(this)), false);
          element.oButton.appendChild(oBtn);
        }

        element.oMain.appendChild(element.oButton);
      }

      //设置css
      for (var key in style) {
        var name = key.replace(/\b(\w)|\s(\w)/g, function (m) {
          return m.toUpperCase();
        });
        var curStyle = style[key];

        for (var attr in curStyle) {
          element['o' + name].style[attr] = curStyle[attr];
        }
      }

      //显示弹层
      doc.body.appendChild(element.oCloud);

      //设置定时器
      if (typeof (setting.time) == 'number') {
        this.timer = setTimeout(function (oCloud) {
          this.close(oCloud);
        }.bind(this, element.oCloud), setting.time);
      }
    },
    open: function (setting, style) {
      this.setting = setting || {};
      this.style = style || {};
      this.init();
    },
    close: function (oCloud) {
      if (!oCloud) {
        oCloud = this.element.oCloud;
      }
      //移除节点
      if (oCloud.parentNode == document.body) {
        document.body.removeChild(oCloud);
        doc.body.style.overflow = '';
      }
    },
    msg: function (content, type, time) {
      var cloudStyle = {};

      if (type == 'top') {
        cloudStyle.top = '50px';
        cloudStyle.bottom = 'auto';
      } else if (type == 'center') {
        cloudStyle.top = 'auto';
        cloudStyle.bottom = '50%';
      } else {
        cloudStyle.top = 'auto';
        cloudStyle.bottom = '50px';
      }

      this.open({
        covered: false,
        content: content,
        time: time || 1000
      }, {
        cloud: cloudStyle,
        main: {
          minWidth: '0'
        },
        content: {
          padding: '0 10px',
          background: 'rgba(85, 85, 85, 0.7)',
          lineHeight: '24px',
          fontSize: '13px',
          color: '#fff'
        }
      });
    },
    explain: function (content) { //系统提示
      this.open({
        title: '系统提示',
        close: true,
        coveredClose: true,
        content: content,
      });
    },
    asked: function (content, leftFn, rightFn) {
      this.open({
        close: false,
        coveredClose: false,
        content: content,
        button: [{
          name: '取消',
          callback: leftFn
        }, {
          name: '确定',
          callback: rightFn
        }]
      });
    },
    alert: function (content) {
      this.open({
        close: false,
        coveredClose: false,
        content: content,
        button: [{
          name: '确定'
        }]
      });
    },
    load: function () {
      this.open({
        covered: true,
        coveredClose: false,
        content: '<div class="cloud-content-loading"></div>'
      }, {
        cloud: {
          top: '40%',
          bottom: 'auto'
        },
        main: {
          minWidth: '0'
        },
        content: {
          padding: '5px',
          background: '#fff',
          lineHeight: '24px',
          fontSize: '13px',
          textAlign: 'center',
          color: '#555'
        }
      });
    }
  };

})(window);
