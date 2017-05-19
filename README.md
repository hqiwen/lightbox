# lightbox

### 用法

1.在HTML文件中引入[jquery](https://code.jquery.com/jquery-3.2.1.min.js)、[lightbox.js](public/js/lightbox.js)、[style.css](public/css/style.css)和icons

    <link rel="stylesheet" type="text/css" href="./css/style.css">
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="./js/lightbox.js"></script>

文档按如下分布

![文档分布](./public/images/文档目录.png)

2.给要添加图片预览的图片加上以下属性：

    class="js-lightbox"//调用lightbox的图片
    data-source="./images/1-3.jpg"//图片源
    data-group="group-1"//图片组别
    data-id="3"//图片ID，唯一标识
    data-caption= "1"//图片标题

3.引入lightbox类

    <script>
        $(function () {
            const lightbox = new LightBox();
        })
    </script>

---


### 示例

    <h1>1组图片</h1>
    <div>
        <img src="./images/1-1.jpg" width="100px" height="100px" class="js-lightbox" data-source="./images/1-1.jpg" data-group="group-1" data-id="1" data-caption= "1">
        <img src="./images/1-2.jpg" width="100px" height="100px" class="js-lightbox" data-source="./images/1-2.jpg" data-group="group-1" data-id="2" data-caption= "1">
        <img src="./images/1-3.jpg" width="100px" height="100px" class="js-lightbox" data-source="./images/1-3.jpg" data-group="group-1" data-id="3" data-caption= "1">
    </div>

![演示](./public/images/演示.gif)


