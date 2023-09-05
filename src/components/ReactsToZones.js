import { SpriteComponent } from "./SpriteComponent";
import { generateMissionControlActions, createLabel, matchClickToData } from "../lib/generateMissionControlActions"

export class ReactsToZones {
    constructor(scene, data, entity) {
        this.scene = scene
        this.data = data
        this.entity = entity

        this.currentZone = {name: null, timestamp:null}
        this.toast = null

        this.missionControl = [
            {name: 'startPickARocket', title: "Choose Your Rocket!", status: false },
            {name: 'pickALaunch', title: "Choose Your Launch Pad!", status: false },
            {name: 'confirmWeather',  title: "Confirm Weather Status!", status: false },
            {name: 'geoLocation', title:"Confirm Your Location!", status: false },
            {name: 'liftoff', title:"Liftoff!?", status: false },
        ]
    }
    async react(zoneName, auto=false){
        if(!this.missionControl[0].status && (!this.currentZone.name || (this.currentZone.name && this.currentZone.timestamp && this.currentZone.timestamp < Date.now() - 7000)))
        {
            this.currentZone.name = zoneName
            this.currentZone.timestamp =  Date.now()
            const sprite = this.entity.getComponent(SpriteComponent).sprite
            this.makeToast(sprite)

            if(zoneName === "missioncontrol"){
                const missioncontrolMessages = [
                    "These new mission control systems are quite fancy...",
                    "So many servers... so little time...",
                    "Into the future!",
                    "Space here I come!",
                    "To infinity and beyond!",
                    "I'm scared..."
                ]
                this.toast.showMessage(missioncontrolMessages[Math.floor(Math.random()*missioncontrolMessages.length)])
            }
            else if(zoneName === "breakroom"){
                const breakroomMessaages = [
                    "Wow a breakroom! This looks fun...",
                    "God does not play dice! But sometimes we do!",
                    "Is that a bed over there?",
                    "mmmm... vending machines... and food on the floor!",
                    "I need a snack...",
                    "I'm hungry... again..."
                ]
                this.toast.showMessage(breakroomMessaages[Math.floor(Math.random()*breakroomMessaages.length)])
            }
            else if(zoneName === "historicalcenter"){
                const historicalcenterMessages = [
                    "Wow, the famed NASA historical center!",
                    "So many artifacts!",
                    "Did I see a knight in shining armor?",
                    "I think they have some moon rocks in here...",
                    "The great rovers of the past are in here...",
                    "I wonder if there is any alien stuff in here..."
                ]
                this.toast.showMessage(historicalcenterMessages[Math.floor(Math.random()*historicalcenterMessages.length)])
            
            }
        }
        else if(zoneName === "launchconsole"){

                const currentStep = this.missionControl.find(step => !step.status)
                if(currentStep.name !== 'startPickARocket' && !auto)
                {
                    return // we only do the logic for the first step here unless auto (when the dialog events take over)
                }
                currentStep['status'] = true

                const sprite = this.entity.getComponent(SpriteComponent).sprite
                const actionData = await generateMissionControlActions(currentStep.name, this.scene, this.missionControl)

                const dialog = this.scene.rexUI.add.dialog(
                        Object.assign({}, this.getDialogConfig(sprite), {
                            content: this.scene.add.text(0, 0, currentStep.title, {
                                fontSize: '24px'
                            })}, {actions: actionData.map(data=>createLabel(this. scene, data.text))})
                    )
                    .layout()
                    .modal({
                        duration: {
                                in: 200,
                                hold: -1,
                                out: 200
                            }
                    })
                dialog
                    .on('button.click', function (button) {
                        const step = this.missionControl.find((step) => step.name === currentStep.name)
                        step.status = true
                        step.data = matchClickToData(button.childrenMap.text.text, actionData)
                        console.log(this.missionControl, "MISSION STATUS")
                        if(this.missionControl.find(step => !step.status)){
                            this.react("launchconsole", true)
                        }
                        else{
                            // liftoff
                        }
                    }, this)
                    .on('button.over', function (button) {
                        button.getElement('background').setStrokeStyle(1, 0xffffff);
                    })
                    .on('button.out', function (button) {
                        button.getElement('background').setStrokeStyle();
                    });
            }
    }
    makeToast(sprite){
        this.toast = this.scene.rexUI.add.toast({
            x: sprite.getBounds()['x'],
            y: sprite.getBounds()['y'],
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, "blue"),
            text: this.scene.add.text(0, 0, '', {
                fontSize: '17px'
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
        
                icon: 0,
                text: 0,
            },
            duration: {
                in: 200,
                hold: 2000,
                out: 200,
            },            
        })
    }
    getDialogConfig(sprite) {
        return {
            x: sprite.getBounds()['x'],
            y: sprite.getBounds()['y'],

            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.scene.rexUI.add.label({
                background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
                text: this.scene.add.text(0, 0, 'Welcome to Mission Control', {
                    fontSize: '24px'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),

            space: {
                title: 25,
                content: 25,
                action: 15,

                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            
            align: {
                actions: 'left', // 'center'|'left'|'right'
            },


            expand: {
                content: false,  // Content is a pure text object                      
            }
            }
    }
}
  