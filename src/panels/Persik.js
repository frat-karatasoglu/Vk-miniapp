import React, { useEffect, useState } from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Header,
  SimpleCell,
} from '@vkontakte/vkui';
import { FormItem } from '@vkontakte/vkui';
import { Select } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Persik = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  // 🎨 Renk paleti kategorilere göre
  const COLORS = {
    '🍔 Еда': '#FF6384',
    '🚕 Транспорт': '#36A2EB',
    '🎮 Развлечения': '#9966FF',
    '🛒 Покупки': '#FFCE56',
    '📦 Другое': '#8D99AE',
    'Без категории': '#999999'
  };

  // localStorage'dan veriyi al
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('expenses'));
    if (saved) setExpenses(saved);
  }, []);

  // 📆 Seçilen aya göre filtrelenmiş harcamalar
  const filteredExpenses = selectedMonth
    ? expenses.filter(item => {
      const date = new Date(item.date);
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ayı 2 haneli yap
      return month === selectedMonth;
    })
    : expenses;

  const total = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  const renderCenterText = ({ cx, cy }) => {
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="16" fontWeight="bold">
        Итого: {total}₽
      </text>
    );
  };

  const categoryData = filteredExpenses.reduce((acc, item) => {
    const category = item.category || 'Без категории';
    const found = acc.find(i => i.name === category);
    if (found) {
      found.value += item.amount;
    } else {
      acc.push({ name: category, value: item.amount });
    }
    return acc;
  }, []);

  const categories = ['🍔 Еда', '🚕 Транспорт', '🎮 Развлечения', '🛒 Покупки', '📦 Другое'];

  const categoryTotals = categories.map(category => {
    const sum = filteredExpenses
      .filter(item => item.category === category)
      .reduce((acc, cur) => acc + cur.amount, 0);
    return { category, sum };
  });

  // Grafik verisi için dönüşüm
  const chartData = categoryTotals
    .filter(item => item.sum > 0)
    .map(item => ({
      name: item.category,
      value: item.sum,
    }));

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Статистика
      </PanelHeader>

      <Group header={<Header mode="secondary">Фильтр по месяцу</Header>}>
        <FormItem top="Выберите месяц">
          <Select
            placeholder="Месяц"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={[
              { label: 'Январь', value: '01' },
              { label: 'Февраль', value: '02' },
              { label: 'Март', value: '03' },
              { label: 'Апрель', value: '04' },
              { label: 'Май', value: '05' },
              { label: 'Июнь', value: '06' },
              { label: 'Июль', value: '07' },
              { label: 'Август', value: '08' },
              { label: 'Сентябрь', value: '09' },
              { label: 'Октябрь', value: '10' },
              { label: 'Ноябрь', value: '11' },
              { label: 'Декабрь', value: '12' }
            ]}
          />
        </FormItem>
      </Group>


      <Group header={<Header mode="secondary">Общая информация</Header>}>
        <SimpleCell>Всего записей: {filteredExpenses.length}</SimpleCell>

      </Group>

      <Group header={<Header mode="secondary">📊 Распределение по категориям</Header>}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <text
              x={80}
              y={130}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="16"
              fontWeight="bold"
            >
              Итого: {total}₽
            </text>

            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || '#ccc'}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {categoryTotals.map((item, index) => (
          <SimpleCell key={index}>
            <span style={{ color: COLORS[item.category] || '#ccc' }}>
              {item.category}
            </span> — {item.sum}₽
          </SimpleCell>
        ))}

      </Group>
    </Panel >
  );
};

Persik.propTypes = {
  id: PropTypes.string.isRequired,
};
