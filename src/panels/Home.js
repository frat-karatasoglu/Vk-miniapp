import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  FormItem,
  Input,
  Button,
  SimpleCell,
  Header
} from '@vkontakte/vkui';

import { Select } from '@vkontakte/vkui';
import { motion, AnimatePresence } from 'framer-motion';

export const Home = ({ id }) => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const categories = [
    { label: <span style={{ color: '#ffcc00' }}>🍔 Еда</span>, value: '🍔 Еда' },
    { label: <span style={{ color: '#00ccff' }}>🚕 Транспорт</span>, value: '🚕 Транспорт' },
    { label: <span style={{ color: '#aa88ff' }}>🎮 Развлечения</span>, value: '🎮 Развлечения' },
    { label: <span style={{ color: '#ff8888' }}>🛒 Покупки</span>, value: '🛒 Покупки' },
    { label: <span style={{ color: '#aaaaaa' }}>📦 Другое</span>, value: '📦 Другое' }
  ];



  // 🔁 Verileri localStorage'dan yükle
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('expenses'));
    if (saved) setExpenses(saved);
  }, []);

  // 💾 Harcamaları kaydet
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount) return;
    const newItem = {
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString() // 📅 Şu anki tarih
    };
    setExpenses([...expenses, newItem]);
    setTitle('');
    setAmount('');
    setCategory(''); // Kategori alanını da sıfırla
  };


  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Panel id={id} style={{ backgroundColor: '#121212', padding: '12px' }}>

      <PanelHeader>Бюджетник</PanelHeader>

      <Group
        header={<Header mode="secondary" >💸 Добавить трату</Header>}
        style={{
          background: 'linear-gradient(135deg, #1f1f1f, #2c2c2c)',
          borderRadius: 16,
          padding: 16,
          margin: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <FormItem top="Название">
          <div style={{ borderRadius: 10, overflow: 'hidden', boxShadow: '0 0 6px rgba(255,255,255,0.1)' }}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, еда"
            />
          </div>
        </FormItem>

        <FormItem top="Сумма (₽)">
          <div style={{
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 0 6px rgba(255,255,255,0.1)'
          }}>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="150"
            />
          </div>
        </FormItem>

        <FormItem top="Категория">
          <div style={{
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 0 6px rgba(255,255,255,0.1)'
          }}>
            <Select
              placeholder="Выберите категорию"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories}
            />

          </div>
        </FormItem>


        <FormItem>
          <Button
            size="l"
            stretched
            style={{
              background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: '0.2s transform ease-in-out'
            }}
            onClick={addExpense}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Добавить
          </Button>
        </FormItem>

      </Group>

      <Group header={<Header mode="secondary">Список трат</Header>}>
        <AnimatePresence>
          {expenses.map((item, index) => (
            <motion.div
              key={item.title + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, rotate: -90, x: -100 }}
              whileHover={{
                scale: 1.03,
                backgroundColor: '#3a3a3c',
                transition: { duration: 0.2 },
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: '#2a2a2c',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#fff'
              }}
            >

              <div style={{ fontWeight: '500', color: '#fff' }}>
                {item.category || '📦 Без категории'} — {item.title}
              </div>
              <div style={{ fontWeight: 'bold', color: '#9ed0ff', display: 'flex', alignItems: 'center' }}>
                {item.amount}₽
                <Button
                  mode="tertiary"
                  size="s"
                  onClick={() => {
                    const updated = [...expenses];
                    updated.splice(index, 1);
                    setExpenses(updated);
                  }}
                  style={{ marginLeft: 10 }}
                >
                  ❌
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </Group>

      <Group style={{
        backgroundColor: '#2a2a2c',
        borderRadius: 18,
        padding: 16,
        margin: 12,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <Header style={{ color: '#fff', textAlign: 'center', fontSize: 20 }}>
          💰 Общая сумма: {total}₽
        </Header>
      </Group>

      <Group>
        <FormItem>
          <Button
            mode="secondary"
            size="l"
            stretched
            onClick={() => window.location.hash = '/persik'}
          >
            Перейти в статистику
          </Button>
        </FormItem>
      </Group>

    </Panel >
  );
};
