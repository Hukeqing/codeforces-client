module.exports = {
    copy: function (value) {
        let tag = document.createElement('textarea');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = value;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
    }
}
