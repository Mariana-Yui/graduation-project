export default {
    nickName: 'DIYGod',
    baseURL: 'http://localhost:7001',
    time: 10 * 1000,
    secret_key: 'diygod',
    upload_domain: 'http://q95bvp3v9.bkt.clouddn.com',
    cropper_options: () => ({
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        autoCropWidth: 80, // 默认生成截图框宽度
        autoCropHeight: 80, // 默认生成截图框高度
        info: true, // 裁剪框的大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        fixedBox: false, // 固定截图框大小 不允许改变
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框是否拖动
        centerBox: true, // 截图框是否被限制在图片里面
        high: true, // 是否按照设备的dpr 输出等比例图片
        mode: 'contain', // 图片默认渲染方式
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        original: true // 上传图片按照原始比例渲染
    }),
    tinymce_plugins:
        'lists image media table wordcount code fullscreen help codesample toc insertdatetime searchreplace link charmap paste hr',
    tinymce_toolbar: () => [
        'bold italic underline strikethrough blockquote|forecolor backcolor|formatselect |fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent |codeformat blockformats| removeformat undo redo ',
        'bullist numlist toc pastetext|codesample charmap  hr insertdatetime |lists image media table link unlink |code searchreplace fullscreen help '
    ]
};
