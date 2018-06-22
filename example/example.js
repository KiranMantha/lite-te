//var liteTE = require('lite-te');
import lcContext from './lc-context';
function sampletemp() {
    return (`
        <div>
            <p>My Name is {{ name }}</p>
            <p lc-click='greet'>My Age is {{ age }}</p>
            <p>My Skills are</p>
            <table>
                <tr data-for='skill in skills'>
                    <td lc-click='showSkill(skill.data)'>{{ skill.data }}</td>
                </tr>
            </table>
        </div>
    `);
}
var context = new lcContext({
    data: {
        name: 'Hello World!!',
        age: 25,
        skills: [
            { data: 'html' },
            { data: 'css' },
            { data: 'javascript' }
        ]
    },
    methods: {
        greet: function () {
            alert(this.age);
        },
        showSkill: function (skill) {
            alert(skill);
            this.greet();
        }
    }
});
// var tpl = document.getElementById('sampleTpl').innerHTML;
// var template = liteTE.compile(tpl, 'div');
// var html = template.bindContext(context);