import {Button, Modal, Form, Input, Select, Radio, Slider} from 'antd';
import {useEffect, useState} from "react";
import {languageOptions, textModelOptions, voiceOptions} from "@/app/config/options.config";

export default function SettingModal(props: any) {
    const [form] = Form.useForm();

    const [randomnessValue, setRandomnessValue] = useState(1)
    const [speechRateValue, setSpeechRateValue] = useState(1); // 初始值根据需要设置

    const {open, onHideSettingModal} = props
    const handleSubmit = () => {
            form.submit()
            onHideSettingModal()
        }
    ;const handleFinish = (values: any) => {
        const configString = JSON.stringify(values);
        console.log(configString, values)
        localStorage.setItem('config', configString)
        form.resetFields()
    };
    useEffect(() => {
        const configString = localStorage.getItem('config');
        if (configString) {
            const config = JSON.parse(configString);
            form.setFieldsValue({
                ...config,
            });
        }
    }, [form, open])


    return (
        <Modal open={open} onCancel={onHideSettingModal} onOk={handleSubmit} title="配置" okText='确认'
               cancelText='取消'>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item label="API Key" name="openai_key">
                    <Input placeholder="输入你的API Key"></Input>
                </Form.Item>

                <Form.Item label="网址/代理镜像源头" tooltip="What do you want others to call you?" name="openai_url">
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


                <Form.Item label="学习语言" name="locale">
                    <Select options={languageOptions}>
                    </Select>
                </Form.Item>

            </Form>
        </Modal>
    )
}