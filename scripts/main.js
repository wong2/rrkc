!function(){

    // 只在首页执行
    if(!window.asyncHTMLManager){
        return;
    }

    filepicker.setKey("AvP-U86sFQfmHgF1EQs0Bz");

    var serialize = function(obj) {
      var str = [];
      for(var p in obj)
         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    };

    var uploadByUrl = function(album_id, image_url, description, callback){
        var data = {
            api_key: "7f96c3fbe7a8400d96e2147780d1734f",
            appId: "182707",
            from: "",
            originType: "photo",
            title: "",
            type: "photo",
            url: "http://www.renren.com",
            albumId: album_id, // "820851965", // album id
            image: image_url,
            content: description || ""
        };

        var req = new XN.net.xmlhttp({
            url: 'http://widget.renren.com/dialog/forward/post',
            method: 'post',
            data: serialize(data),
            onSuccess: function(r){
                (callback || XN.func.empty)();
            },
            onError: function(){
                XN.DO.showError('网络错误', '错误提示');
            }
        });
    };

    var getAlbumList = function(callback){

        var url = 'http://photo.' + XN.env.domain + '/photo/'+ XN.user.id + '/album/common/ajax';

        var req = new XN.net.xmlhttp({
            url: url,
            method: 'get',
            onSuccess: function(r){
                var data = XN.json.parse(r.responseText);
                (callback || XN.func.empty)(data.list);
            },
            onError: function(){
                XN.DO.showError('网络错误', '错误提示');
            }
        });

    };

    var showUploadDialog = function(url){
        getAlbumList(function(albums){
            var html = '<img src="' + url + '" width="200"><textarea style="height:50px;display:block" class="rrkc_desc" placeholder="照片描述"></textarea>';

            html = html + '<select class="rrkc_select">' + albums.map(function(album){
                return '<option value="' + album.id + '">' + album.name + '</option>';
            }).join('') + '</select>';

            var dialog = XN.DO.confirm({
                title: "上传图片",
                message: html,
                width: 500,
                modal: true,
                callback: function(r){
                    if(!r) return;

                    var body = dialog.body;

                    var e = Sizzle(".rrkc_select", body)[0],
                        album_id = e.options[e.selectedIndex].value;

                    var description = Sizzle(".rrkc_desc", body)[0].value;
                    var proxied_url = "http://imgproxy.sinaapp.com/?image=" + url;

                    var m_alert = XN.DO.alert({
                        message: "上传中..."
                    });
                    m_alert.footer.hide();

                    uploadByUrl(album_id, proxied_url, description, function(){
                        m_alert.body.innerHTML = "上传成功!";
                        setTimeout(function(){
                            m_alert.remove();
                        }, 1000);
                    });
                }
            });
        });

    };

    var container = $("global-publisher-photo-box");

    var pick = function(){
        filepicker.getFile('image/*', showUploadDialog);
    };

    var section = container.getElementsByClassName("video-uploader")[0];
    section.innerHTML = "";
    var a = $element("a");
    a.href = "javascript:void(0)";
    a.html("<h4>人人快传</h4><p>从网络上快速上传</p>");
    a.addEventListener("click", pick, false);
    section.appendChild(a);

}();
