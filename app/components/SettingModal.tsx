import {Button, Modal, Form, Input, Select, Radio, Slider} from 'antd';
import {useState} from "react";

export default function SettingModal(props: any) {
    const [form] = Form.useForm();

    const [randomnessValue, setRandomnessValue] = useState(1)
    const [speechRateValue, setSpeechRateValue] = useState(1); // 初始值根据需要设置

    const {open, onHideSettingModal} = props
    const handleSubmit = () => {
        form.submit()
        // localStorage.setItem('config', form)

    }
    const handleFinish = (values: any) => {
        console.log(values); // 这里会打印出表单的值
        localStorage.setItem('config', values)
    };

    const textModelOptions = [
        {
            value: 'gpt-4',
            label: 'gpt-4'
        },
        {
            value: 'gpt-4-turbo',
            label: 'gpt-4-turbo',
        },
        {
            value: 'gpt-3-turbo',
            label: 'gpt-3-turbo',
        }
    ]
    const voiceOptions = [
        {
            value: 'alloy',
            label: 'Alloy'
        },
        {
            value: 'echo',
            label: 'Echo'
        },
        {
            value: 'fable',
            label: 'Fable'
        },
        {
            value: 'onyx',
            label: 'Onyx'
        },
        {
            value: 'nova',
            label: 'Nova'
        },
        {
            value: 'shimmer',
            label: 'Shimmer'
        },
    ];


    return (
        <Modal open={open} onCancel={onHideSettingModal} onOk={handleSubmit}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item label="API Key" name="api">
                    <Input placeholder="输入你的API Key"></Input>
                </Form.Item>

                <Form.Item label="网址/代理镜像源头" tooltip="What do you want others to call you?" name="url">
                    <Input placeholder="输入你的网址/镜像源"></Input>
                </Form.Item>

                <Form.Item label="语言模型" name="textModel">
                    <Select options={textModelOptions}>
                    </Select>
                </Form.Item>
                <Form.Item label="语音模型" name="voiceModel">
                    <Radio.Group>
                        <Radio value="tts-1"> tts-1 </Radio>
                        <Radio value="tts-1-hd"> tts-1-hd </Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="声音模型" name="voice">
                    <Select options={voiceOptions}>
                    </Select>
                </Form.Item>
                <Form.Item label="随机" tooltip="数字越高，AI输出就越随机" name="randomness">
                    <Slider
                        min={0}
                        max={2}
                        onChange={setRandomnessValue}
                        value={randomnessValue}
                        step={0.01}
                    />
                </Form.Item>

                <Form.Item label="语速" tooltip="数字越高，语速越快" name='speechRate'>
                    <Slider
                        min={0.25}
                        max={4}
                        onChange={setSpeechRateValue}
                        value={speechRateValue}
                        step={0.01}
                    />
                </Form.Item>


            </Form>
        </Modal>
    )
}