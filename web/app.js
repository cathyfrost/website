new Vue({
  el: '#app',
  data: {
    name: '王语桐',
    about: '我是常州工学院软件工程专业的学生，目前就读大三，致力于提升自己的开发技能和技术水平。',
    school: '常州工学院',
    studentId: '22030527',
    major: '软件工程',
    grade: '大三',
    qq: '626533700',  // QQ 号码
    wechat: 'w626533700',  // 微信号码
    phone: '18901459828',  // 手机号码
    github: 'https://github.com/cathyfrost',  // GitHub 链接
    gitee: 'https://gitee.com/cathyfrost',  // Gitee 链接
    skills: ['JavaScript', 'Vue.js', 'HTML5', 'CSS3', 'Python', 'Java'],
    formData: {
      name: '',
      email: '',
      message: ''
    },
    submitted: false,
    isDragging: false,
    gravity: 0.6, // 重力值
    velocityY: 0, // Y轴速度
  },
  methods: {
    // 表单提交方法
    submitForm() {
      const formData = {
        name: this.formData.name,
        email: this.formData.email,
        message: this.formData.message
      };

      // 将表单数据发送到指定的后端服务器
      fetch('http://127.0.0.1:5000/submit_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          this.submitted = true;
          console.log(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },

    // 初始化桌宠的逻辑
    initPet() {
      const pet = document.getElementById('pet');
      const petContainer = document.getElementById('pet-container');

      // 小宠物图像数组
      const petImages = [
        'assets/2.gif'
        // 'assets/3.gif',
        // 'assets/4.gif',
        // 'assets/5.gif',
        // 'assets/6.gif'
      ];
      let currentImageIndex = 0;

      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      pet.addEventListener('mousedown', (e) => {
        e.preventDefault();  // 阻止默认行为
        isDragging = true;
        this.isDragging = true;
        offsetX = e.clientX - petContainer.getBoundingClientRect().left;
        offsetY = e.clientY - petContainer.getBoundingClientRect().top;
        petContainer.classList.add('dragging');
        pet.style.transform = 'scale(1.5)'; // 放大
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          petContainer.style.left = `${e.clientX - offsetX}px`;
          petContainer.style.top = `${e.clientY - offsetY}px`;
        }
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        this.isDragging = false;
        petContainer.classList.remove('dragging');
        pet.style.transform = 'scale(1)'; // 恢复原始大小
      });

      // 添加双击事件监听器来更换小宠物图像
      pet.addEventListener('dblclick', () => {
        currentImageIndex = (currentImageIndex + 1) % petImages.length;
        pet.src = petImages[currentImageIndex]; // 更换图像
      });

      this.applyGravity(petContainer); // 启用重力效果
    },

    // 应用重力效果到桌宠
    applyGravity(petContainer) {
      const groundLevel = window.innerHeight - petContainer.clientHeight - 230; // 地面水平线
      const reboundFactor = -0.7; // 回弹系数，-0.6 表示每次碰撞速度减少 40%

      const gravityLoop = () => {
        if (!this.isDragging) {
          let currentTop = parseFloat(petContainer.style.top) || 0;
          this.velocityY += this.gravity;
          currentTop += this.velocityY;

          if (currentTop >= groundLevel) {
            currentTop = groundLevel;
            this.velocityY *= reboundFactor; // 应用回弹系数，反向速度
          }

          if (currentTop < 0) {
            currentTop = 0;
            this.velocityY *= reboundFactor;
          }

          petContainer.style.top = `${currentTop}px`;
        }

        requestAnimationFrame(gravityLoop);
      };

      gravityLoop();
    }
  },
  mounted() {
    this.initPet();  // 初始化桌宠
  }
});
